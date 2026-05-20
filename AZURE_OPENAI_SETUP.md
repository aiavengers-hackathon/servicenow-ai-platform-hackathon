# Azure OpenAI Setup Guide for ServiceNow AI Platform

## Overview
This project has been updated to use Azure OpenAI instead of local Ollama. This guide will help you set up Azure OpenAI credentials.

## Prerequisites
- Azure subscription with Azure OpenAI access
- Azure OpenAI resource deployed in Azure Portal
- Python 3.11+

## Step 1: Get Azure OpenAI Credentials

1. **Log in to Azure Portal**: https://portal.azure.com

2. **Navigate to your Azure OpenAI Resource**:
   - Go to "Azure OpenAI" service
   - Select your OpenAI resource

3. **Get the Endpoint**:
   - Click on "Keys and Endpoint" in the left sidebar
   - Copy the "Endpoint" value (format: `https://<resource-name>.openai.azure.com/`)

4. **Get the API Key**:
   - From the same "Keys and Endpoint" page
   - Copy either "Key 1" or "Key 2"

5. **Get the Deployment Name**:
   - Click on "Model deployments" in the left sidebar
   - Note the deployment name (e.g., "gpt-4", "gpt-35-turbo")
   - Make sure the deployment is in "Succeeded" status

## Step 2: Configure Environment Variables

### For Local Development:

1. **Edit `.env` file** in `/backend/`:
   ```bash
   cd backend
   nano .env
   ```

2. **Fill in the values**:
   ```
   AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
   AZURE_OPENAI_API_KEY=your-api-key-here
   AZURE_OPENAI_API_VERSION=2024-02-15-preview
   AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
   ```

3. **Save and close** (Ctrl+O, Enter, Ctrl+X for nano)

### For Docker Deployment:

1. **Create a `.env` file** in the root directory (same level as docker-compose.yml):
   ```bash
   AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
   AZURE_OPENAI_API_KEY=your-api-key-here
   AZURE_OPENAI_API_VERSION=2024-02-15-preview
   AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
   ```

2. **Build and run**:
   ```bash
   docker-compose up --build
   ```

## Step 3: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Step 4: Run the Application

### Local Development:
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
```

### Docker:
```bash
docker-compose up
```

## Key Files Updated

- **`requirements.txt`**: Added `langchain-openai`, `openai`, and `azure-identity` packages; removed `ollama` and `langchain-ollama`
- **`app/ai/llm.py`**: Updated to use `AzureChatOpenAI` instead of `OllamaLLM`
- **`app/services/ai_services.py`**: Updated to use Azure OpenAI client with proper message formatting
- **`docker-compose.yml`**: Removed Ollama service; added Azure environment variables to backend service
- **`.env`**: Configuration file with Azure credentials placeholders

## Troubleshooting

### Error: "Invalid API Key"
- Check that the API key is correct
- Ensure you're using the right Azure OpenAI resource
- Verify the API key is not expired

### Error: "Deployment not found"
- Check the deployment name matches exactly
- Verify the deployment status is "Succeeded" in Azure Portal
- Ensure the deployment is in the same region as your endpoint

### Error: "Unauthorized"
- Check the API version format (should be YYYY-MM-DD-preview)
- Verify endpoint URL ends with `/`
- Confirm API key has not been rotated

### Error: "Connection refused"
- For Docker: Ensure all containers are running (`docker-compose ps`)
- Check network configuration in docker-compose.yml
- Verify environment variables are properly set

## API Version Reference

The current configuration uses: `2024-02-15-preview`

For other versions, visit: https://learn.microsoft.com/en-us/azure/ai-services/openai/reference

## Testing the Setup

```bash
# After starting the application, test the chat endpoint:
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, help me with a ServiceNow incident"}'
```

## Performance Notes

- Azure OpenAI provides enterprise-grade security and compliance
- Responses may be slightly slower than local models due to network latency
- Azure offers better uptime and scalability for production use
- Consider token usage for cost optimization

## Additional Resources

- Azure OpenAI Documentation: https://learn.microsoft.com/en-us/azure/ai-services/openai/
- LangChain OpenAI Integration: https://python.langchain.com/docs/integrations/llms/azure_openai
- FastAPI Documentation: https://fastapi.tiangolo.com/
