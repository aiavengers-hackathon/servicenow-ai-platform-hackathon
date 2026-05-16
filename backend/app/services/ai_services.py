from langchain_community.llms import Ollama

llm = Ollama(
    model="mistral",
    base_url="http://ollama:11434"
)

def generate_response(prompt: str):

    system_prompt = f"""
    You are a ServiceNow enterprise AI assistant.

    User Request:
    {prompt}
    """

    response = llm.invoke(system_prompt)

    return response