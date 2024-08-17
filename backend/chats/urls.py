from rest_framework import routers
from django.urls import path

from .views import ChatView, CreateChatView, CreateMessageView

router = routers.DefaultRouter()
router.root_view_name = 'Chats'

urlpatterns = router.urls

urlpatterns += [
    path('chat', ChatView.as_view(), name='get-chat'),
    path('create', CreateChatView.as_view(), name='create-chat'),
]
