from langchain_ollama import OllamaLLM

llm = OllamaLLM(
    model="llama3",
    base_url="http://ollama:11434"
)