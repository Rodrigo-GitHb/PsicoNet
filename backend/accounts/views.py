from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from .serializers import RegisterSerializer, UserPublicSerializer, ProfileUpdateSerializer

User = get_user_model()


# ── Cadastro ──────────────────────────────────────────────────────────────────
class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ — cria conta e retorna tokens JWT."""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # Gera os tokens automaticamente após cadastro
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserPublicSerializer(user, context={"request": request}).data,
            },
            status=status.HTTP_201_CREATED,
        )


# ── Perfil do usuário autenticado ─────────────────────────────────────────────
class MeView(APIView):
    """
    GET  /api/auth/me/  → retorna dados do usuário logado
    PATCH /api/auth/me/ → atualiza nome, bio, avatar, senha etc.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserPublicSerializer(request.user, context={"request": request})
        return Response(serializer.data)

    def patch(self, request):
        serializer = ProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserPublicSerializer(user, context={"request": request}).data)


# ── Perfil público de qualquer usuário ────────────────────────────────────────
class UserDetailView(generics.RetrieveAPIView):
    """GET /api/auth/users/<username>/"""
    queryset = User.objects.all()
    serializer_class = UserPublicSerializer
    lookup_field = "username"
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# ── Lista de todos os usuários (Discover / Explore) ───────────────────────────
class UserListView(generics.ListAPIView):
    """GET /api/auth/users/ — retorna todos os usuários (exceto o autenticado)."""
    serializer_class = UserPublicSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.exclude(pk=self.request.user.pk).order_by("username")


# ── Follow / Unfollow ─────────────────────────────────────────────────────────
class FollowToggleView(APIView):
    """
    POST /api/auth/users/<username>/follow/
    Segue o usuário se ainda não segue; deixa de seguir se já segue.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        target = get_object_or_404(User, username=username)

        if target == request.user:
            return Response(
                {"detail": "Você não pode seguir a si mesmo."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if request.user.following.filter(pk=target.pk).exists():
            request.user.following.remove(target)
            action = "unfollowed"
        else:
            request.user.following.add(target)
            action = "followed"

        return Response(
            {
                "action": action,
                "target": UserPublicSerializer(target, context={"request": request}).data,
            }
        )


# ── Lista de seguidores e seguidos ────────────────────────────────────────────
class FollowersView(generics.ListAPIView):
    """GET /api/auth/users/<username>/followers/"""
    serializer_class = UserPublicSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = get_object_or_404(User, username=self.kwargs["username"])
        return user.followers.all()


class FollowingView(generics.ListAPIView):
    """GET /api/auth/users/<username>/following/"""
    serializer_class = UserPublicSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = get_object_or_404(User, username=self.kwargs["username"])
        return user.following.all()
