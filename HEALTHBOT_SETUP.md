# Health Bot Setup Guide

## Overview
The Health Bot is an AI-powered fitness and nutrition consultant chatbot integrated into SlugBites. It helps users create personalized nutrition plans based on their fitness goals and preferences.

## Configuration

### 1. Set Up n8n Webhook

The chatbot connects to an n8n workflow. You need to:

1. Deploy your n8n workflow (the JSON configuration provided)
2. Get your n8n webhook URL
3. Set the environment variable:

**For Local Development:**
Create a `.env` file in the root directory:
```
REACT_APP_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/28884611-bc36-4aff-a395-3fa78040765c
```

**For Vercel Deployment:**
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - Key: `REACT_APP_N8N_WEBHOOK_URL`
   - Value: Your n8n webhook URL
   - Environment: Production, Preview, Development

### 2. n8n Workflow Setup

The workflow expects POST requests with this format:
```json
{
  "message": "User's message text",
  "sessionId": "unique-session-id"
}
```

The workflow should return a response in one of these formats:
- `{ "output": "response text" }`
- `{ "message": "response text" }`
- `{ "text": "response text" }`
- `{ "response": "response text" }`
- `{ "choices": [{ "message": { "content": "response text" } }] }`

### 3. Testing

1. Start your local development server: `npm start`
2. Look for the floating 💪 button in the bottom-right corner
3. Click it to open the chat interface
4. Start chatting with Nathan, the AI fitness consultant

## Features

- **Floating Chat Widget**: Always accessible via the bottom-right button
- **Session Management**: Maintains conversation context
- **Real-time Responses**: Connects to your n8n workflow for AI responses
- **Mobile Responsive**: Works on all device sizes
- **Typing Indicators**: Shows when the bot is processing

## Customization

You can customize the chatbot by modifying:
- `src/components/HealthBot.js` - Chat logic and API integration
- `src/components/HealthBot.css` - Styling and appearance

## Troubleshooting

**Chatbot not responding:**
- Check that `REACT_APP_N8N_WEBHOOK_URL` is set correctly
- Verify your n8n workflow is active and accessible
- Check browser console for errors

**CORS Issues:**
- Make sure your n8n instance allows requests from your domain
- Configure CORS headers in n8n if needed

