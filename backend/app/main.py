import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import auth as r_auth, users as r_users, animals as r_animals, listings as r_listings, favorites as r_favs, uploads as r_uploads, messaging as r_msg, admin as r_admin

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pawnie API", version="0.2.0")

origins = [o.strip() for o in os.getenv("BACKEND_CORS_ORIGINS", "").split(",") if o.strip()]
if origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get("/api/health")
def health():
    return {"status":"ok"}

app.include_router(r_auth.router, prefix="/api")
app.include_router(r_users.router, prefix="/api")
app.include_router(r_animals.router, prefix="/api")
app.include_router(r_listings.router, prefix="/api")
app.include_router(r_favs.router, prefix="/api")
app.include_router(r_uploads.router, prefix="/api")
app.include_router(r_msg.router, prefix="/api")
app.include_router(r_admin.router, prefix="/api")