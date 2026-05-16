from langchain_chroma import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vector_store = Chroma(
    collection_name="knowledge",
    embedding_function=embedding,
    persist_directory="./data/chroma"
)

def search_docs(query):

    docs = vector_store.similarity_search(query, k=3)

    return docs