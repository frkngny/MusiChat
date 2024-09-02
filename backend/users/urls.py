from rest_framework import routers
from django.urls import path, include

from .views import CurrentUserView, UserMessagesView, SendFriendshipView, RemoveFriendView, FriendshipRequestsView, AnswerFriendshipRequestView

router = routers.DefaultRouter()
router.root_view_name = 'Users'

urlpatterns = router.urls

urlpatterns += [
    path('currentuser', CurrentUserView.as_view(), name='current_user'),
    path('auth/', include('users.auth.urls')),
    path('user-messages', UserMessagesView.as_view(), name='user-messages'),
    path('send-friend-request', SendFriendshipView.as_view(), name='send-friend-request'),
    path('friend-requests', FriendshipRequestsView.as_view(), name='friend-requests'),
    path('answer-friend-requests', AnswerFriendshipRequestView.as_view(), name='answer-friend-requests'),
    path('remove-friend', RemoveFriendView.as_view(), name='remove-friend'),
]
