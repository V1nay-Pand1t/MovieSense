from django.urls import path, include
from accounts import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    
    # JWT Authentication URLs
    path('auth/jwt/login/', views.JWTLoginView.as_view(), name='jwt_login'),
    path('auth/jwt/refresh/', TokenRefreshView.as_view(), name='jwt_refresh'),
    path('auth/jwt/verify/', TokenVerifyView.as_view(), name='jwt_verify'),
    path('auth/jwt/register/', views.JWTRegisterView.as_view(), name='jwt_register'),
        
    # User Management URLs
    path('user/profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('user/change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    
    # Protected endpoint example
    path('protected/', views.ProtectedView.as_view(), name='protected'),
]
