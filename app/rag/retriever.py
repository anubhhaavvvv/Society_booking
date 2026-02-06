from app.rag.indexer import get_rag_index
from app.core.llm import llm_client
from app.chat.prompts import RAG_PROMPT


def retrieve_answer(query: str) -> str:
    rag = get_rag_index()
    docs = rag.search(query)

    if not docs:
        return llm_client.generate(query)

    context = "\n".join(d.page_content for d in docs)

    prompt = RAG_PROMPT.format(
        context=context,
        question=query
    )

    return llm_client.generate(prompt)
