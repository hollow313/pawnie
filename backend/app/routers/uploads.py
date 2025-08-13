import os, uuid
from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from ..deps import get_current_user

router = APIRouter(prefix="/uploads", tags=["uploads"])
UPLOAD_DIR = "/app/uploads"

@router.post("")
async def upload_image(file: UploadFile = File(...), user = Depends(get_current_user)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Fichier non image")
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(file.filename or "")[1].lower() or ".jpg"
    name = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(UPLOAD_DIR, name)
    with open(path, "wb") as f:
        f.write(await file.read())
    return {"url": f"/uploads/{name}"}