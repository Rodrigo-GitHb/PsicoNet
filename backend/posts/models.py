from django.db import models
from django.conf import settings


class Post(models.Model):
    """Uma publicação na rede."""
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="posts",
    )
    content = models.TextField(max_length=560)
    image = models.ImageField(upload_to="posts/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Post"
        verbose_name_plural = "Posts"

    def __str__(self):
        return f"@{self.author.username}: {self.content[:60]}"

    @property
    def likes_count(self):
        return self.likes.count()

    @property
    def comments_count(self):
        return self.comments.count()


class Like(models.Model):
    """Curtida de um usuário em um post."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="likes_given",
    )
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "post")
        verbose_name = "Curtida"

    def __str__(self):
        return f"{self.user.username} curtiu {self.post.id}"


class Comment(models.Model):
    """Comentário em um post."""
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="comments",
    )
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField(max_length=280)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        verbose_name = "Comentário"

    def __str__(self):
        return f"@{self.author.username} em post {self.post.id}: {self.content[:40]}"
