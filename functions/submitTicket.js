require('dotenv').config();

const { LINEAR_API_TOKEN, LINEAR_CONFIG } = process.env;

const axios = require('axios');

const { sendErrorToSlack } = require('../error_log');

const Constants = require('../constants');
const { oxfordJoinArray } = require('../utils/oxfordJoinArray');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'Origin, X-Requested-With, Content-Type, Accept',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': '*',
};

exports.handler = async (event, context, callback) => {
  try {
    if (!LINEAR_CONFIG) {
      return {
        headers: headers,
        statusCode: 200,
        body: JSON.stringify({
          success: false,
          msg:
            'No config variable found. Check your deployment page to help generate this variable then add it to your deploy secrets.',
        }),
      };
    }

    const Config = JSON.parse(LINEAR_CONFIG);

    if (!Config.teamId) {
      return {
        headers: headers,
        statusCode: 200,
        body: JSON.stringify({
          success: false,
          msg:
            'No teamId in the config variable found. Check your deployment page to help generate this variable then add it to your deploy secrets.',
        }),
      };
    }

    const body = JSON.parse(event.body);

    // take the incoming label type string and relate it to a linear label ID
    const getTicketLabelIds = (ticketLabels = []) => {
      const ticketLabelIds = ticketLabels
        .filter((ticketLabel) => {
          return Config.labels[ticketLabel] ? true : false;
        })
        .map((ticketLabel) => Config.labels[ticketLabel]);

      return ticketLabelIds;
    };

    const createMarkdownComment = (device_info, user_info) => {
      const createDeviceInfoMarkdown = (device_info) => {
        if (!device_info) {
          return;
        }

        const formattedDeviceInfoObj = Object.keys(device_info)
          .map((key) => `\u00A0\u00A0\u00A0**${key}:** ${device_info[key]}\n`)
          .join('');

        return `**Device Info**\n` + formattedDeviceInfoObj;
      };

      const createUserInfoMarkdown = (user_info) => {
        if (!user_info) {
          return;
        }

        const formattedUserInfoObj = Object.keys(user_info)
          .map((key) => `\u00A0\u00A0\u00A0**${key}:** ${user_info[key]}\n`)
          .join('');

        return `**User Info**\n` + formattedUserInfoObj;
      };

      return (
        `---\n` +
        createDeviceInfoMarkdown(device_info) +
        `\u00A0\n\u00A0` +
        createUserInfoMarkdown(user_info) +
        `\n\n___`
      );
    };

    const createTicketMutation = (title, description, ticketLabels) => {
      return {
        query: `
            mutation { 
              issueCreate(
                input: {
                  description: "${
                    description.match(/\w/gm)
                      ? description
                      : 'User did not leave a description'
                  }",
                  title: "${title.match(/\w/gm) ? title : 'No title Provided'}",
                  teamId: "${Config.teamId}",
                  projectId: "${Config.projectId}",
                  labelIds: ${JSON.stringify(getTicketLabelIds(ticketLabels))},
                  ${
                    Config.defaultAssigneeId
                      ? `assigneeId: "${Config.defaultAssigneeId}",`
                      : ``
                  }
                  stateId: "${Config.inboxStateId}",
                })
              {
                success
                issue {
                  id
                }
              }
            }
          `,
      };
    };

    const createCommentMutation = (issueId, device_info, user_info) => {
      return {
        query: `
            mutation { 
              commentCreate(
                input: {
                  body: ${JSON.stringify(
                    createMarkdownComment(device_info, user_info)
                  )},
                  issueId: "${issueId}",
                })
              {
                success
              }
            }
          `,
      };
    };

    let createTicketRequest = await axios({
      url: `https://api.linear.app/graphql`,
      method: 'POST',
      data: createTicketMutation(
        body?.title,
        body?.description,
        body?.ticketLabels
      ),
      headers: { Authorization: LINEAR_API_TOKEN },
    });

    const response = createTicketRequest.data.data?.issueCreate;

    if (
      createTicketRequest.data.errors ||
      !response?.success ||
      !response?.issue?.id
    ) {
      const errorMessage = oxfordJoinArray(
        createTicketRequest?.data?.errors.map((err) => err.message) || [],
        'and',
        Constants.ticketCreateFailMessage
      );
      return {
        headers: headers,
        statusCode: 200,
        body: JSON.stringify({
          success: false,
          msg: errorMessage,
        }),
      };
    }

    let addCommentToTicketRequest = await axios({
      url: `https://api.linear.app/graphql`,
      method: 'POST',
      data: createCommentMutation(
        response?.issue?.id,
        body?.device_info,
        body?.user_info
      ),
      headers: { Authorization: LINEAR_API_TOKEN },
    });

    const success = addCommentToTicketRequest.data.data?.commentCreate?.success;

    const responseToUser = {
      success: success ? true : false,
      msg: success
        ? Constants.ticketCreateSuccessMessage
        : Constants.ticketCreateFailMessage,
    };

    return {
      headers: headers,
      statusCode: 200,
      body: JSON.stringify(responseToUser),
    };
  } catch (err) {
    const error = err?.response?.data?.errors || err?.response || err;
    console.log(error);
    await sendErrorToSlack(error, 'TICKET BODY: ' + body);
    return {
      headers: headers,
      statusCode: 200,
      body: JSON.stringify({ success: false, msg: 'There was an error.' }),
    };
  }
};
