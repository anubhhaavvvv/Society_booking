from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import FAISS


class RAGIndex:
    def __init__(self):
        self.embeddings = OllamaEmbeddings(
            model="nomic-embed-text",
            base_url="http://localhost:11434"
        )
        self.vectorstore = None

    def build(self, texts: list[str]):
        self.vectorstore = FAISS.from_texts(texts, self.embeddings)

    def search(self, query: str, k: int = 3):
        if self.vectorstore is None:
            return []
        return self.vectorstore.similarity_search(query, k=k)
