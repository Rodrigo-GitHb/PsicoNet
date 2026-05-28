from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Post

User = get_user_model()


class SocialApiTests(APITestCase):
    def setUp(self):
        self.alice = User.objects.create_user(
            username="alice",
            email="alice@example.com",
            password="StrongPass123!",
            first_name="Alice",
        )
        self.bob = User.objects.create_user(
            username="bob",
            email="bob@example.com",
            password="StrongPass123!",
            first_name="Bob",
        )
        self.carla = User.objects.create_user(
            username="carla",
            email="carla@example.com",
            password="StrongPass123!",
            first_name="Carla",
        )
        self.bob_post = Post.objects.create(author=self.bob, content="Reflexao de Bob")
        self.carla_post = Post.objects.create(author=self.carla, content="Reflexao de Carla")
        self.client.force_authenticate(self.alice)

    def test_feed_returns_only_followed_users_posts(self):
        self.alice.following.add(self.bob)

        response = self.client.get("/api/posts/feed/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        contents = [item["content"] for item in response.data]
        self.assertIn(self.bob_post.content, contents)
        self.assertNotIn(self.carla_post.content, contents)

    def test_follow_toggle_updates_network(self):
        response = self.client.post("/api/auth/users/bob/follow/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["action"], "followed")
        self.assertTrue(self.alice.following.filter(pk=self.bob.pk).exists())

        response = self.client.post("/api/auth/users/bob/follow/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["action"], "unfollowed")
        self.assertFalse(self.alice.following.filter(pk=self.bob.pk).exists())

    def test_post_like_and_comment(self):
        like_response = self.client.post(f"/api/posts/{self.bob_post.pk}/like/")

        self.assertEqual(like_response.status_code, status.HTTP_200_OK)
        self.assertEqual(like_response.data["likes_count"], 1)
        self.assertTrue(like_response.data["is_liked"])

        comment_response = self.client.post(
            f"/api/posts/{self.bob_post.pk}/comments/",
            {"content": "Obrigado por compartilhar."},
            format="json",
        )

        self.assertEqual(comment_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(comment_response.data["content"], "Obrigado por compartilhar.")
        self.assertEqual(comment_response.data["author"]["username"], "alice")

    def test_profile_update_keeps_fields_optional_and_changes_password(self):
        response = self.client.patch(
            "/api/auth/me/",
            {
                "first_name": "Alice Atualizada",
                "bio": "Nova bio",
                "old_password": "StrongPass123!",
                "new_password": "NewStrongPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.alice.refresh_from_db()
        self.assertEqual(self.alice.first_name, "Alice Atualizada")
        self.assertEqual(self.alice.bio, "Nova bio")
        self.assertTrue(self.alice.check_password("NewStrongPass123!"))
