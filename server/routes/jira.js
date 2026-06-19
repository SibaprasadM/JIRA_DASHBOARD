const express = require('express');
const axios = require('axios');
const router = express.Router();

function getAuthHeader() {
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;
  const encoded = Buffer.from(`${email}:${token}`).toString('base64');
  return `Basic ${encoded}`;
}

function getBaseUrl() {
  return process.env.JIRA_BASE_URL;
}

const jiraApi = () =>
  axios.create({
    baseURL: `${getBaseUrl()}/rest/agile/1.0`,
    headers: {
      Authorization: getAuthHeader(),
      Accept: 'application/json',
    },
  });

router.get('/sprint/active', async (req, res) => {
  try {
    const boardId = process.env.JIRA_BOARD_ID;
    if (!boardId) {
      return res.status(400).json({ error: 'JIRA_BOARD_ID not configured' });
    }

    const response = await jiraApi().get(`/board/${boardId}/sprint`, {
      params: { state: 'active' },
    });

    const activeSprint = response.data.values[0];
    if (!activeSprint) {
      return res.status(404).json({ error: 'No active sprint found' });
    }

    res.json(activeSprint);
  } catch (error) {
    console.error('Error fetching active sprint:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch active sprint',
      details: error.response?.data?.errorMessages || error.message,
    });
  }
});

router.get('/sprint/:sprintId/stats', async (req, res) => {
  try {
    const { sprintId } = req.params;

    const response = await jiraApi().get(`/sprint/${sprintId}/issue`, {
      params: {
        maxResults: 100,
        fields: 'summary,status,assignee,priority,customfield_10016,issuetype',
      },
    });

    const issues = response.data.issues;

    const statusCount = {};
    const statusCategoryCount = { 'To Do': 0, 'In Progress': 0, Done: 0 };
    const priorityCount = {};
    const assigneeCount = {};
    let totalPoints = 0;
    let donePoints = 0;

    issues.forEach((issue) => {
      const status = issue.fields.status.name;
      const category = issue.fields.status.statusCategory.name;
      const priority = issue.fields.priority?.name || 'None';
      const assignee = issue.fields.assignee?.displayName || 'Unassigned';
      const points = issue.fields.customfield_10016 || 0;

      statusCount[status] = (statusCount[status] || 0) + 1;
      if (statusCategoryCount[category] !== undefined) {
        statusCategoryCount[category]++;
      }
      priorityCount[priority] = (priorityCount[priority] || 0) + 1;
      assigneeCount[assignee] = (assigneeCount[assignee] || 0) + 1;

      totalPoints += points;
      if (category === 'Done') {
        donePoints += points;
      }
    });

    res.json({
      total: issues.length,
      statusCategory: statusCategoryCount,
      status: statusCount,
      priority: priorityCount,
      assignees: assigneeCount,
      storyPoints: { total: totalPoints, done: donePoints },
    });
  } catch (error) {
    console.error('Error fetching sprint stats:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch sprint stats',
      details: error.response?.data?.errorMessages || error.message,
    });
  }
});

module.exports = router;
