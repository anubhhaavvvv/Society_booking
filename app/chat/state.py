# app/chat/state.py

_STATE = {}

def get_state(conversation_id: str):
    return _STATE.setdefault(conversation_id, {})

def update_state(conversation_id: str, **kwargs):
    _STATE.setdefault(conversation_id, {}).update(kwargs)

def clear_state(conversation_id: str):
    _STATE.pop(conversation_id, None)
