from rest_framework import serializers
from .models import Post, Like, Comment
from accounts.serializers import UserPublicSerializer


class CommentSerializer(serializers.ModelSerializer):
    author = UserPublicSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "author", "content", "created_at"]
        read_only_fields = ["id", "author", "created_at"]


class PostSerializer(serializers.ModelSerializer):
    author = UserPublicSerializer(read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)
    is_liked = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            "id", "author", "content", "image",
            "likes_count", "comments_count", "is_liked",
            "comments", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "author", "created_at", "updated_at"]

    def get_is_liked(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["id", "content", "image", "created_at"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        validated_data["author"] = self.context["request"].user
        return super().create(validated_data)
