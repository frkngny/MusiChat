from rest_framework import routers
from django.urls import path

from .views import CreateRoomView, RoomsView

router = routers.DefaultRouter()
router.root_view_name = 'Rooms'

urlpatterns = router.urls

urlpatterns += [
    path('all', RoomsView.as_view(), name='get_rooms'),
    path('create', CreateRoomView.as_view(), name='create_room'),
]
