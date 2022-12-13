from django.urls import path
from . import views

# to include routes for Simple JWT’s
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

# urls used for authentication
urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('', views.getRoutes),
    path('test/', views.testEndPoint, name='test')
]
