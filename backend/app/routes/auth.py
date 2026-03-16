from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.database_models import User
from ..services.auth_service import oauth, create_access_token
from ..config.settings import settings

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.get("/login/github")
async def login_github(request: Request):
    # Hardcoded for HF Spaces to solve proxy issues
    if ".hf.space" in str(request.base_url):
        redirect_uri = f"https://{request.headers.get('host')}/auth/github/callback"
    else:
        redirect_uri = request.url_for('auth_github_callback')
    
    return await oauth.github.authorize_redirect(request, str(redirect_uri))

@router.get("/github/callback", name="auth_github_callback")
async def auth_github_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.github.authorize_access_token(request)
        user_data = await oauth.github.get('user', token=token)
        user_info = user_data.json()
        
        # GitHub might not share email if it's set to private
        email = user_info.get("email")
        if not email:
            # Fallback for hidden emails
            emails_data = await oauth.github.get('user/emails', token=token)
            emails = emails_data.json()
            email = next((e['email'] for e in emails if e['primary']), emails[0]['email'])

        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(
                email=email,
                name=user_info.get("name") or user_info.get("login"),
                provider="github",
                provider_id=str(user_info.get("id"))
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        jwt_token = create_access_token(data={"sub": user.id})
        return {"access_token": jwt_token, "token_type": "bearer", "api_key": user.api_key}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Authentication failed: {str(e)}")

@router.get("/me")
async def get_me(request: Request):
    # This will be used to verify the JWT session
    pass
