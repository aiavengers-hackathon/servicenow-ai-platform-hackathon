from langchain_openai import AzureChatOpenAI
import os
from dotenv import load_dotenv

load_dotenv()

llm = AzureChatOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview"),
    model=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4")
)


def generate_response(prompt: str):
    system_prompt = (
        "You are a ServiceNow enterprise AI assistant.\n"
        "Provide helpful, accurate, and professional responses to user requests."
    )

    # Try structured messages first, fallback to single prompt string
    try:
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ]
        response = llm.invoke(messages)
    except Exception:
        try:
            response = llm.invoke(system_prompt + "\n\n" + prompt)
        except Exception as e:
            return f"AI service error: {e}"

    # Normalize response to string
    if hasattr(response, "content"):
        return response.content
    if isinstance(response, str):
        return response
    try:
        return response["content"]
    except Exception:
        return str(response)