from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, APIKeyHeader
from jose import jwt
from sqlalchemy.orm import Session
from .database import get_db
from .models.database_models import User
from .config.settings import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    api_key: str = Depends(api_key_header)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # 1. Check API Key (for CLI/Direct usage)
    if api_key:
        user = db.query(User).filter(User.api_key == api_key).first()
        if user:
            return user

    # 2. Check JWT Token (for Web usage)
    if token:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id: str = payload.get("sub")
            if user_id is None:
                raise credentials_exception
        except Exception:
            raise credentials_exception
            
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise credentials_exception
        return user

    raise credentials_exception
