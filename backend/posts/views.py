from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from .models import Post, Like, Comment
from .serializers import PostSerializer, PostCreateSerializer, CommentSerializer

User = get_user_model()


class FeedView(generics.ListAPIView):
    """
    GET /api/posts/feed/
    Retorna posts das pessoas que o usuário autenticado segue,
    ordenados do mais recente ao mais antigo.
    """
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        following_ids = self.request.user.following.values_list("id", flat=True)
        return Post.objects.filter(author_id__in=following_ids).select_related("author")


class ExploreView(generics.ListAPIView):
    """
    GET /api/posts/explore/
    Retorna todos os posts (exceto do próprio usuário) para descoberta.
    """
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.exclude(author=self.request.user).select_related("author")


class PostListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/posts/          → lista todos os posts do usuário autenticado
    POST /api/posts/          → cria um novo post
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return PostCreateSerializer
        return PostSerializer

    def get_queryset(self):
        return Post.objects.filter(author=self.request.user).select_related("author")

    def create(self, request, *args, **kwargs):
        serializer = PostCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        post = serializer.save()
        return Response(
            PostSerializer(post, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class UserPostsView(generics.ListAPIView):
    """GET /api/posts/user/<username>/ → posts públicos de um usuário específico."""
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = get_object_or_404(User, username=self.kwargs["username"])
        return Post.objects.filter(author=user).select_related("author")


class PostDetailView(generics.RetrieveDestroyAPIView):
    """
    GET    /api/posts/<id>/  → detalhe de um post
    DELETE /api/posts/<id>/  → apaga (somente o autor)
    """
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.all().select_related("author")

    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        if post.author != request.user:
            return Response(
                {"detail": "Você não pode apagar o post de outra pessoa."},
                status=status.HTTP_403_FORBIDDEN,
            )
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LikeToggleView(APIView):
    """
    POST /api/posts/<id>/like/
    Curte o post se ainda não curtiu; descurte se já curtiu.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        like, created = Like.objects.get_or_create(user=request.user, post=post)

        if not created:
            like.delete()
            action = "unliked"
        else:
            action = "liked"

        return Response(
            {
                "action": action,
                "likes_count": post.likes.count(),
                "is_liked": created,
            }
        )


class CommentListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/posts/<id>/comments/ → lista comentários
    POST /api/posts/<id>/comments/ → adiciona comentário
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        post = get_object_or_404(Post, pk=self.kwargs["pk"])
        return Comment.objects.filter(post=post).select_related("author")

    def perform_create(self, serializer):
        post = get_object_or_404(Post, pk=self.kwargs["pk"])
        serializer.save(author=self.request.user, post=post)
