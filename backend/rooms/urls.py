from rest_framework import routers
from django.urls import path

from .views import CreateRoom

router = routers.DefaultRouter()
router.root_view_name = 'Rooms'

urlpatterns = router.urls

urlpatterns += [
    path('create', CreateRoom.as_view(), name='create_room'),
]
