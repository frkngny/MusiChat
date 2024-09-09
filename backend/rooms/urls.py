from rest_framework import routers
from django.urls import path

from .views import CreateRoomView, RoomsView, RoomView, MyRoomsView, PublicRoomsView, JoinRoomView, LeaveRoomView, KickUserView, BanUnbanUserView, GetRoomSettingsView, UpdateRoomSettingsView

router = routers.DefaultRouter()
router.root_view_name = 'Rooms'

urlpatterns = router.urls

urlpatterns += [
    path('all', RoomsView.as_view(), name='get_rooms'),
    path('create', CreateRoomView.as_view(), name='create'),
    path('myrooms', MyRoomsView.as_view(), name='my'),
    path('public', PublicRoomsView.as_view(), name='public'),
    path('room/<str:key>', RoomView.as_view(), name='get_room'),
    path('join/<str:key>', JoinRoomView.as_view(), name='join_room'),
    path('leave/<str:key>', LeaveRoomView.as_view(), name='leave_room'),
    path('room/<str:key>/kick', KickUserView.as_view(), name='kick_user'),
    path('room/<str:key>/ban-unban', BanUnbanUserView.as_view(), name='ban_user'),
    path('room/<str:key>/settings', GetRoomSettingsView.as_view(), name='room_settings'),
    path('room/<str:key>/settings/update', UpdateRoomSettingsView.as_view(), name='update_room_settings'),
]
