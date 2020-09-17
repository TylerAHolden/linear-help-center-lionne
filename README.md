[![Netlify Status](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/TylerAHolden/linear-help-center)

# Help Center Serverless Functions

This repository acts as the intermediary functions that connect a client-side form to linear without exposing a linear API token to the client.

# Functions

## submitTicket

> [POST] https://{{YOU_NETLIFY_DOMAIN}}.netlify.app/.netlify/functions/submitTicket

| Key          | Type            | Description                                                   |
| ------------ | --------------- | ------------------------------------------------------------- |
| title        | string          | Title for ticket                                              |
| description  | string          | Description for ticket                                        |
| ticketLabels | Array\<string\> | String that matches a label key value in constants.js         |
| user_info    | object          | Key/value pairs will be sent as the first comment on a ticket |
| device_info  | object          | Key/value pairs will be sent as the first comment on a ticket |

Example Request Body

```
{
	"title": "Keeps crashing",
	"description": "Something is wrong with my app dood",
	"ticketLabels": ["bug"],
	"user_info": {
		"id": "1234",
		"username": "johndoe",
		"profile_page": "[https://myapp.com/johndoe](https://myapp.com/johndoe)",
		...
		[key: string]: string
		...
	},
	"device_info": {
		"os": "ios",
		"version": "2.84.0",
		"build_number": "14982",
		...
		[key: string]: string
		...
	},
}
```
