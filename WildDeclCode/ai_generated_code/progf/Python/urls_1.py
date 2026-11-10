"""
URL configuration for entraide_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from api.views import DecoratedTokenObtainPairView, DecoratedTokenRefreshView

# Aided with basic GitHub coding tools
schema_view = get_schema_view(
    openapi.Info(
        title="Entraide National API",
        default_version='v1',
        description="""
# Entraide National Platform API

## Overview
This API provides endpoints for managing the Entraide National platform, including user management, 
centers, programs, students, teachers, associations, and more.

## Authentication
The API uses JSON Web Tokens (JWT) for authentication. To authenticate:

1. Obtain a token pair by sending your credentials to `/api/token/`
2. Include the access token in the Authorization header of your requests: `Authorization: Bearer <token>`
3. Use the refresh token to get a new access token when it expires by sending it to `/api/token/refresh/`
4. To log out, blacklist your refresh token by sending it to `/api/accounts/users/logout/`

## Rate Limiting
API requests are subject to rate limiting to ensure fair usage.

## User Roles
- 1: Student
- 2: Teacher
- 3: Admin
- 4: Staff
        """,
        terms_of_service="https://www.entraide-national.ma/terms/",
        contact=openapi.Contact(email="contact@entraide-national.ma"),
        license=openapi.License(name="Proprietary License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/centers-app/', include('centers.urls')),
    path('api/associations/', include('associations.urls')),
    path('api/students/', include('students.urls')),
    path('api/teachers/', include('teachers.urls')),
    path('api/programs/', include('programs.urls')),
    path('api/courses/', include('courses.urls')),
    path('api/schedule/', include('schedule.urls')),
    path('api/attendance/', include('attendance.urls')),
    
    # Use decorated token views with enhanced documentation
    path('api/token/', DecoratedTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', DecoratedTokenRefreshView.as_view(), name='token_refresh'),
    
    # API documentation
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
