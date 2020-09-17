const axios = require('axios');
const { DONT_SEND_SLACK_MESSAGES, SLACK_WEBHOOK_URL } = process.env;

export const sendErrorToSlack = async (body, body2) => {
  if (DONT_SEND_SLACK_MESSAGES === 'true' || !SLACK_WEBHOOK_URL) {
    return;
  }
  const sendErrorLog = await axios.post(SLACK_WEBHOOK_URL, {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            '```' +
            JSON.stringify(body) +
            (body2 ? JSON.stringify(body2) : '') +
            '```',
        },
      },
    ],
  });
};
