from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/posts/", include("posts.urls")),
    path("api/interactions/", include("interactions.urls")),
    path("", TemplateView.as_view(template_name="index.html"), name="frontend"),
    path("<path:path>", TemplateView.as_view(template_name="index.html"), name="frontend-routes"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)