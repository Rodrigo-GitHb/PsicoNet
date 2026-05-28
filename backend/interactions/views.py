from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from accounts.serializers import UserPublicSerializer

User = get_user_model()


class SuggestedUsersView(generics.ListAPIView):
    """
    GET /api/interactions/suggestions/
    Retorna usuários que o usuário atual ainda não segue (para o RightRail).
    """
    serializer_class = UserPublicSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        following_ids = self.request.user.following.values_list("id", flat=True)
        return (
            User.objects
            .exclude(pk=self.request.user.pk)
            .exclude(pk__in=following_ids)
            .order_by("?")[:5]   # até 5 sugestões aleatórias
        )
