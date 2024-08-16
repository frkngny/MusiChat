from rest_framework import routers
from django.urls import path

from .views import ChatView

router = routers.DefaultRouter()
router.root_view_name = 'Chats'

urlpatterns = router.urls

urlpatterns += [
    path('chat', ChatView.as_view(), name='get_chat'),
]
