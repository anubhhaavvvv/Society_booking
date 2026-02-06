import re
from datetime import date
from app.core.llm import llm_client

ISO_DATE_RE = re.compile(r"\b(\d{4}-\d{2}-\d{2})\b")

SYSTEM_PROMPT = """
You are a date interpretation engine.

Rules:
- Today is {today}
- Convert user input into a single ISO date (YYYY-MM-DD)
- Understand:
  - today, tomorrow
  - this weekend, next weekend
  - weekdays (monday, sunday)
  - dates like "10 jan", "10 january"
- Do NOT add explanations.
- If unclear, return NONE.
"""

def normalize_date(message: str) -> str | None:
    prompt = SYSTEM_PROMPT.format(today=date.today().isoformat()) + f"""

User input: "{message}"
Answer:
"""

    raw = llm_client.generate(prompt=prompt).strip()

    # ✅ HARD ENFORCEMENT
    match = ISO_DATE_RE.search(raw)
    if match:
        return match.group(1)

    return None
