from django.shortcuts import render
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer, 
    ChangePasswordSerializer
)
from datetime import timedelta
from django.conf import settings

# Token-based Authentication Views
class RegisterView(generics.CreateAPIView):
    """User registration endpoint"""
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create token for the new user
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    """Token-based login endpoint"""
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Login successful'
        })

class LogoutView(APIView):
    """Logout endpoint - deletes the token"""
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
        except:
            return Response({
                'error': 'Error logging out'
            }, status=status.HTTP_400_BAD_REQUEST)

# JWT Authentication Views
class JWTLoginView(TokenObtainPairView):
    """JWT login endpoint with HttpOnly cookie response"""
    def post(self, request, *args, **kwargs):
        print(request.data)

        response = super().post(request, *args, **kwargs)
        print("Response:", response.data)
        print("Status Code:", response.status_code)
        if response.status_code == 200:
            access = response.data.get('access')
            refresh = response.data.get('refresh')
            # Set cookies
            cookie_params = {
                'httponly': True,
                'secure': True,
                'samesite': 'Lax',
                'path': '/',
            }
            # Set access token cookie
            response.set_cookie(
                'access_token', access,
                max_age=getattr(settings, 'SIMPLE_JWT', {}).get('ACCESS_TOKEN_LIFETIME', timedelta(minutes=5)).total_seconds(),
                **cookie_params
            )
            # Set refresh token cookie
            response.set_cookie(
                'refresh_token', refresh,
                max_age=getattr(settings, 'SIMPLE_JWT', {}).get('REFRESH_TOKEN_LIFETIME', timedelta(days=1)).total_seconds(),
                **cookie_params
            )

            ## Add user data to response 
            # {'username': 'vinay2', 'email': 'vinaypanditx8@gmail.com', 'password': 'dota_123'}
            userdata = request.data
            response.data['user'] = {
                'username': userdata.get('username'),
                'email': userdata.get('email'),
                'password': userdata.get('password')
            }
        return response

class JWTRegisterView(generics.CreateAPIView):
    """JWT registration endpoint with HttpOnly cookie response"""
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)
        refresh_token = str(refresh)
        response = Response({
            'user': UserSerializer(user).data,
            'refresh': refresh_token,
            'access': access,
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)
        # Set cookies
        cookie_params = {
            'httponly': True,
            'secure': True,
            'samesite': 'Lax',
            'path': '/',
        }
        response.set_cookie(
            'access_token', access,
            max_age=getattr(settings, 'SIMPLE_JWT', {}).get('ACCESS_TOKEN_LIFETIME', timedelta(minutes=5)).total_seconds(),
            **cookie_params
        )
        response.set_cookie(
            'refresh_token', refresh_token,
            max_age=getattr(settings, 'SIMPLE_JWT', {}).get('REFRESH_TOKEN_LIFETIME', timedelta(days=1)).total_seconds(),
            **cookie_params
        )
        return response

# User Management Views
class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile"""
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class ChangePasswordView(APIView):
    """Change user password"""
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        
        # Check old password
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({
                'error': 'Old password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Set new password
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({
            'message': 'Password changed successfully'
        })

# Protected View Example
class ProtectedView(APIView):
    """Example of a protected API endpoint"""
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response({
            'message': f'Hello {request.user.username}!',
            'user_id': request.user.id,
            'is_staff': request.user.is_staff

        })
