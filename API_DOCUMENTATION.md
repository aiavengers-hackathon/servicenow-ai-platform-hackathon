# API Documentation - ServiceNow AI Platform

## 📋 Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Request/Response Format](#requestresponse-format)
- [Endpoints](#endpoints)
- [Error Handling](#error-handling)
- [Examples](#examples)
- [Rate Limiting](#rate-limiting)

## Overview

The ServiceNow AI Platform API provides REST endpoints for:
- AI-powered chat conversations
- Intent detection for ServiceNow requests
- Knowledge base search
- Conversation history management

**Version**: 1.0.0  
**Last Updated**: May 2026

## Base URL

```
Development:  http://localhost:5000/api
Production:   https://api.servicenow-ai.com/api
```

## Authentication

Currently, the API requires no authentication. In production, implement:
- API Keys
- OAuth 2.0
- JWT tokens

## Request/Response Format

### Content Type
All requests should include:
```
Content-Type: application/json
```

### Standard Response Format

**Success (2xx)**:
```json
{
  "success": true,
  "type": "incident|access_request|change_request|general",
  "data": {},
  "message": "Description of result"
}
```

**Error (4xx/5xx)**:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Endpoints

### Chat Endpoints

#### POST /api/chat

Send a message to the AI assistant.

**Request**:
```json
{
  "message": "Help me create an incident for VPN not working"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "type": "incident",
  "severity": "high",
  "response": "I've detected this is an incident report. I'll create an incident ticket for you...",
  "data": {
    "ticketNumber": "INC0123456",
    "status": "created",
    "estimatedResolutionTime": "4 hours"
  }
}
```

**Response** (General Chat - 200):
```json
{
  "success": true,
  "type": "general",
  "response": "Here's how to reset your password...",
  "data": {}
}
```

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | string | Yes | User message to process |

**Status Codes**:
- `200`: Success
- `400`: Invalid request
- `500`: Server error

**Example**:
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need access to the BAAMR application"
  }'
```

---

#### POST /api/chat/history

Get conversation history for a user.

**Request**:
```json
{
  "userId": "user123",
  "limit": 10
}
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2026-05-21T10:30:00Z",
      "userMessage": "Help me with an incident",
      "aiResponse": "I'll help you create an incident...",
      "type": "incident"
    }
  ],
  "total": 1
}
```

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | No | User identifier (defaults to "default") |
| `limit` | integer | No | Number of messages to return (default: 50) |

---

### Intent Detection Endpoints

#### POST /api/intents/detect

Detect the intent from user message without generating a full response.

**Request**:
```json
{
  "message": "I need access for John to BAAMR"
}
```

**Response** (200):
```json
{
  "success": true,
  "intent": {
    "type": "access_request",
    "confidence": 0.95,
    "application": "BAAMR",
    "urgency": "medium"
  }
}
```

**Intent Types**:

| Type | Description | Example |
|------|-------------|---------|
| `incident` | Report a problem or outage | "VPN is not working" |
| `access_request` | Request application access | "I need access to BAAMR" |
| `change_request` | Request a system change | "Update the database version" |
| `general` | General question | "How do I reset my password?" |

---

### Knowledge Base Endpoints

#### GET /api/kb/search

Search the knowledge base using natural language.

**Request**:
```
GET /api/kb/search?query=password%20reset&limit=5
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "kb_123",
      "title": "How to Reset Your Password",
      "content": "To reset your password, follow these steps...",
      "relevance": 0.98,
      "url": "/kb/articles/kb_123"
    }
  ],
  "total": 1
}
```

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query |
| `limit` | integer | No | Max results (default: 5, max: 20) |

---

#### GET /api/kb/articles/{id}

Get a specific knowledge base article.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "kb_123",
    "title": "How to Reset Your Password",
    "content": "Full article content...",
    "tags": ["password", "account"],
    "lastUpdated": "2026-05-20T14:30:00Z"
  }
}
```

---

### System Endpoints

#### GET /

Health check endpoint.

**Response** (200):
```json
{
  "status": "running",
  "version": "1.0.0",
  "timestamp": "2026-05-21T10:30:00Z"
}
```

---

#### GET /docs

Interactive API documentation (Swagger UI).

**Accessible at**: `http://localhost:5000/docs`

---

## Error Handling

### Error Response Structure

```json
{
  "success": false,
  "error": "Invalid request format",
  "code": "INVALID_REQUEST",
  "details": {
    "field": "message",
    "reason": "Message cannot be empty"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Response |
|------|---------|----------|
| `200` | OK | Request successful |
| `400` | Bad Request | Invalid parameters or format |
| `422` | Unprocessable Entity | Validation error |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error |
| `503` | Service Unavailable | Service temporarily down |

### Common Error Codes

| Code | Message | Solution |
|------|---------|----------|
| `INVALID_REQUEST` | Invalid request format | Check JSON syntax |
| `MISSING_FIELD` | Required field missing | Include required fields |
| `INVALID_MESSAGE` | Message content invalid | Check message length/format |
| `INTENT_DETECTION_FAILED` | Could not detect intent | Try rephrasing |
| `AZURE_OPENAI_ERROR` | Azure OpenAI service error | Check API credentials |
| `DATABASE_ERROR` | Database connection failed | Verify database connection |

---

## Examples

### Example 1: Create an Incident

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "The VPN server is down and no one can connect"
  }'
```

**Response**:
```json
{
  "success": true,
  "type": "incident",
  "severity": "high",
  "response": "I've created an incident ticket for the VPN server outage.",
  "data": {
    "ticketNumber": "INC0000123",
    "priority": "1 - Critical"
  }
}
```

### Example 2: Request Application Access

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need access to Salesforce for the new project"
  }'
```

**Response**:
```json
{
  "success": true,
  "type": "access_request",
  "response": "Access request for Salesforce has been submitted for approval.",
  "data": {
    "requestNumber": "REQ0000456",
    "status": "pending_approval",
    "estimatedCompletionDate": "2026-05-25"
  }
}
```

### Example 3: General Question

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I update my profile information?"
  }'
```

**Response**:
```json
{
  "success": true,
  "type": "general",
  "response": "To update your profile: 1) Log in to ServiceNow... 2) Click your avatar... 3) Select 'Edit Profile'...",
  "data": {}
}
```

### Example 4: Search Knowledge Base

```bash
curl -X GET "http://localhost:5000/api/kb/search?query=password%20reset&limit=3"
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "kb_789",
      "title": "Password Reset Procedure",
      "content": "Step-by-step guide...",
      "relevance": 0.99
    }
  ]
}
```

---

## Rate Limiting

### Current Limits (Development)

- **No rate limiting** in development mode
- **Production will implement**: 100 requests/minute per client

### Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1621598400
```

---

## Request/Response Examples by SDK

### Python (Requests)

```python
import requests

url = "http://localhost:5000/api/chat"
payload = {"message": "Help me with an incident"}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
data = response.json()

if data['success']:
    print(f"Type: {data['type']}")
    print(f"Response: {data['response']}")
else:
    print(f"Error: {data['error']}")
```

### JavaScript (Fetch)

```javascript
const message = "Help me with an incident";

fetch('http://localhost:5000/api/chat', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({ message })
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    console.log(`Type: ${data.type}`);
    console.log(`Response: ${data.response}`);
  } else {
    console.error(`Error: ${data.error}`);
  }
});
```

### JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

async function chat(message) {
  try {
    const { data } = await api.post('/chat', { message });
    console.log(data.response);
  } catch (error) {
    console.error(error.response.data.error);
  }
}
```

---

## Webhooks (Future)

Planned webhook support for:
- Chat message events
- Ticket creation
- Status updates

---

## Versioning

Current API version: **v1**

Future versions will maintain backward compatibility where possible. Breaking changes will increment the major version number.

---

## Support & Documentation

- **Swagger/OpenAPI UI**: `http://localhost:5000/docs`
- **ReDoc Documentation**: `http://localhost:5000/redoc`
- **Setup Guide**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Development Guide**: See [DEVELOPMENT.md](./DEVELOPMENT.md)

---

**Last Updated**: May 2026  
**Maintainer**: ServiceNow AI Platform Team
