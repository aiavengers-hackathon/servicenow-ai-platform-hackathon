from langchain_openai import AzureChatOpenAI
import os
from dotenv import load_dotenv
import concurrent.futures
import logging
from typing import Any

load_dotenv()

llm = AzureChatOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview"),
    model=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4")
)

logger = logging.getLogger(__name__)


def _invoke_llm(messages: Any):
    """Internal helper to call the llm.invoke API."""
    return llm.invoke(messages)


def _normalize_response(response: Any) -> str:
    if hasattr(response, "content"):
        return response.content
    if isinstance(response, str):
        return response
    try:
        return response["content"]
    except Exception:
        return str(response)


def generate_response(prompt: str, timeout: int = 15) -> str:
    """Generate a response from the LLM with a timeout (seconds).

    If the LLM call exceeds `timeout` seconds, returns a friendly error string
    instead of blocking indefinitely.
    """
    system_prompt = (
        "You are a ServiceNow enterprise AI assistant.\n"
        "Provide helpful, accurate, and professional responses to user requests."
    )

    messages = [{"role": "system", "content": system_prompt}, {"role": "user", "content": prompt}]

    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as ex:
        future = ex.submit(_invoke_llm, messages)
        try:
            response = future.result(timeout=timeout)
        except concurrent.futures.TimeoutError:
            future.cancel()
            logger.error("LLM invoke timed out after %s seconds", timeout)
            return "AI service timeout, please try again in a few seconds."
        except Exception as e:
            logger.exception("LLM invoke failed: %s", e)
            # Attempt a simpler fallback call synchronously with its own short timeout
            try:
                future2 = ex.submit(_invoke_llm, system_prompt + "\n\n" + prompt)
                response = future2.result(timeout=5)
            except Exception as e2:
                logger.exception("LLM fallback failed: %s", e2)
                return f"AI service error: {e2}"

    return _normalize_response(response)