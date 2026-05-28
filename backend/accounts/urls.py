from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

urlpatterns = [
    # Auth
    path("register/", views.RegisterView.as_view(), name="register"),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # Perfil autenticado
    path("me/", views.MeView.as_view(), name="me"),
    # Usuários
    path("users/", views.UserListView.as_view(), name="user-list"),
    path("users/<str:username>/", views.UserDetailView.as_view(), name="user-detail"),
    path("users/<str:username>/follow/", views.FollowToggleView.as_view(), name="follow-toggle"),
    path("users/<str:username>/followers/", views.FollowersView.as_view(), name="followers"),
    path("users/<str:username>/following/", views.FollowingView.as_view(), name="following"),
]
