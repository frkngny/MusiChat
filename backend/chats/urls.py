from rest_framework import routers
from django.urls import path

from .views import ChatDetailView, CreateChatView, CreateMessageView

router = routers.DefaultRouter()
router.root_view_name = 'Chats'

urlpatterns = router.urls

urlpatterns += [
    path('chat', ChatDetailView.as_view(), name='get-chat'),
    path('create', CreateChatView.as_view(), name='create-chat'),
    path('chat/send-message', CreateMessageView.as_view(), name='send-chat-message'),
]
