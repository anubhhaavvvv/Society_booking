from app.rag.index import RAGIndex

_rag_index = None


def get_rag_index():
    global _rag_index

    if _rag_index is None:
        _rag_index = RAGIndex()
        _rag_index.build([
            "The society gym is open from 6 AM to 10 PM.",
            "The swimming pool is closed on Mondays.",
            "Badminton courts can be booked for 1 hour slots.",
            "Guest access requires prior approval."
        ])

    return _rag_index
