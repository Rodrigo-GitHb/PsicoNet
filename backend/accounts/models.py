from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Usuário customizado com campos extras para o perfil de psicologia.
    """
    bio = models.TextField(blank=True, default="")
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    location = models.CharField(max_length=120, blank=True, default="")
    website = models.URLField(max_length=200, blank=True, default="")
    # Seguidores e seguidos via M2M auto-referencial
    following = models.ManyToManyField(
        "self",
        symmetrical=False,
        related_name="followers",
        blank=True,
    )

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"

    def __str__(self):
        return self.username

    @property
    def followers_count(self):
        return self.followers.count()

    @property
    def following_count(self):
        return self.following.count()
