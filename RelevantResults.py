from sentence_transformers import SentenceTransformer

from langchain.docstore.document import Document
from langchain.document_loaders.base import BaseLoader
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings

class RelevantResults:
    def __init__(self) -> None:
        self.embedding_model = HuggingFaceEmbeddings(model_name='dunzhang/stella_en_1.5B_v5', model_kwargs={"trust_remote_code": True})

    def create_documents(self, data):
        docs=[]
        for url,text in data.items():
            docs.append(Document(page_content = text, metadata={"source":url}))
        return docs
    
    def retrieve_relevant_results(self, data):
        faiss_embeddings = FAISS.from_documents(documents=self.create_documents(data), embedding=self.embedding_model)
        results = faiss_embeddings.as_retriever(search_type="similarity", search_kwargs={'k': 3})
        return results
