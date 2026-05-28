from django.urls import path
from . import views

urlpatterns = [
    path("suggestions/", views.SuggestedUsersView.as_view(), name="suggestions"),
]
