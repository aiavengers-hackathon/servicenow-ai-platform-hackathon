from langchain_openai import AzureChatOpenAI
from langchain.schema import SystemMessage, HumanMessage
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

    system_prompt = """
    You are a ServiceNow enterprise AI assistant.
    Provide helpful, accurate, and professional responses to user requests.
    """

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=prompt)
    ]

    response = llm.invoke(messages)

    return response.content