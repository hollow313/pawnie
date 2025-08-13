from fastapi import APIRouter, Depends
from ..deps import get_current_user
from .. import schemas, models

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=schemas.UserOut)
def me(current: models.User = Depends(get_current_user)):
    return current