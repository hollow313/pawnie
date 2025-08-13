import re
def slugify(name: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9\- ]+", "", name or "")
    s = s.strip().lower().replace(" ", "-")
    s = re.sub(r"-{2,}", "-", s)
    return s[:64] or "item"