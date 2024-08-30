from rest_framework import routers
from django.urls import path

from .views import CreateRoomView, RoomsView, RoomView, MyRoomsView, PublicRoomsView, JoinRoomView, LeaveRoomView, KickUserView

router = routers.DefaultRouter()
router.root_view_name = 'Rooms'

urlpatterns = router.urls

urlpatterns += [
    path('all', RoomsView.as_view(), name='get_rooms'),
    path('create', CreateRoomView.as_view(), name='create'),
    path('room', RoomView.as_view(), name='get_room'),
    path('my', MyRoomsView.as_view(), name='my'),
    path('public', PublicRoomsView.as_view(), name='public'),
    path('join', JoinRoomView.as_view(), name='join_room'),
    path('leave', LeaveRoomView.as_view(), name='leave_room'),
    path('room/kick', KickUserView.as_view(), name='kick_user'),
]
