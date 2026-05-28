from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserPublicSerializer(serializers.ModelSerializer):
    """Serializer público — usado em listas, feed, cards de perfil."""
    followers_count = serializers.IntegerField(read_only=True)
    following_count = serializers.IntegerField(read_only=True)
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "username", "first_name", "last_name",
            "bio", "avatar", "location", "website",
            "followers_count", "following_count", "is_following",
            "date_joined",
        ]

    def get_is_following(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return request.user.following.filter(pk=obj.pk).exists()
        return False


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer de cadastro com validação de senha."""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "first_name", "last_name", "password", "password2"]

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "As senhas não coincidem."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        user = User.objects.create_user(**validated_data)
        return user


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer de edição de perfil — todos os campos são opcionais."""
    old_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    new_password = serializers.CharField(
        write_only=True, required=False, allow_blank=True,
        validators=[validate_password],
    )

    class Meta:
        model = User
        fields = [
            "first_name", "last_name", "bio",
            "avatar", "location", "website",
            "old_password", "new_password",
        ]

    def validate(self, attrs):
        old_password = attrs.get("old_password", "")
        new_password = attrs.get("new_password", "")
        # Só valida senha se o usuário enviou algo
        if new_password and not old_password:
            raise serializers.ValidationError(
                {"old_password": "Informe a senha atual para alterá-la."}
            )
        if old_password and not self.instance.check_password(old_password):
            raise serializers.ValidationError({"old_password": "Senha atual incorreta."})
        return attrs

    def update(self, instance, validated_data):
        new_password = validated_data.pop("new_password", "")
        validated_data.pop("old_password", "")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if new_password:
            instance.set_password(new_password)

        instance.save()
        return instance
