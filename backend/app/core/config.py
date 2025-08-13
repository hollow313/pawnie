from pydantic import BaseModel
import os

class Settings(BaseModel):
    api_v1_prefix: str = "/api/v1"
    cors_origins: list[str] = ["*"]  # ajuste si besoin
    nominatim_url: str = os.getenv("NOMINATIM_URL", "https://nominatim.openstreetmap.org/search")

settings = Settings()
