# Linear Help Center :phone:

[![Netlify Status](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/TylerAHolden/linear-help-center)

## What is this?

This is simply a serverless function that accepts a JSON body and creates a ticket on [linear.app](https://linear.app).

> In other words, it's an intermediary function that connects a client-side form to linear without exposing your linear API token to the client.

## Why?

Have you ever needed a help center/bug report/suggest improvement form for your users? Building out your own service can get complex really quick. Paying for a third party service can get expensive... really quick. What if you needed something just a bit more organized than a slack webhook or email notification? And you wanted to set something up really quickly. Linear Help Center is the one-click deploy solution that pairs with [linear.app](https://linear.app) as the source of ticket management.

## Rough setup guide

1. Deploy this project on netlify
   > Netlify builds and sets up the serverless function automatically
2. Create a form on your client application that sends a POST request to the deployed serverless function
3. When "called" (pun intended), the serverless function creates a ticket on Linear

## Setup Guide

// @TODO

## submitTicket

### [POST] https://{{YOUR_NETLIFY_DOMAIN}}.netlify.app/.netlify/functions/submitTicket

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
