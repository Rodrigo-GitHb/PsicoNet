from django.urls import path
from . import views

urlpatterns = [
    path("", views.PostListCreateView.as_view(), name="post-list-create"),
    path("feed/", views.FeedView.as_view(), name="feed"),
    path("explore/", views.ExploreView.as_view(), name="explore"),
    path("user/<str:username>/", views.UserPostsView.as_view(), name="user-posts"),
    path("<int:pk>/", views.PostDetailView.as_view(), name="post-detail"),
    path("<int:pk>/like/", views.LikeToggleView.as_view(), name="like-toggle"),
    path("<int:pk>/comments/", views.CommentListCreateView.as_view(), name="comments"),
]
