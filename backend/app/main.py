from fastapi import FastAPI
from .database import init_db
from .routers import auth as r_auth, users as r_users, animals as r_animals, listings as r_listings, favorites as r_favs, uploads as r_uploads, messaging as r_msg, admin as r_admin
from .routers.vets import router as r_vets
from .routers.vets import router as r_vets
# ...
app.include_router(r_vets, prefix="/api")


app = FastAPI(title="Pawnie API")

init_db()

app.include_router(r_auth.router, prefix="/api")
app.include_router(r_users.router, prefix="/api")
app.include_router(r_animals.router, prefix="/api")
app.include_router(r_listings.router, prefix="/api")
app.include_router(r_favs.router, prefix="/api")
app.include_router(r_uploads.router, prefix="/api")
app.include_router(r_msg.router, prefix="/api")
app.include_router(r_admin.router, prefix="/api")
app.include_router(r_vets, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = FastAPI()
api.include_router(vets.router, prefix="")
api.include_router(geocode.router, prefix="")

app.mount("/api/v1", api)

@app.get("/api/health")
def health():
    return {"status":"ok"}
