from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from rest_framework import status, views
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .serializers import CreateRoomSerializer, RoomSerializer, RoomSettingsSerializer
from .models import Room
from users.serializers import UserSerializer

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


class RoomsView(ListAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = RoomSerializer
    queryset = Room.objects.all()

class RoomView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RoomSerializer
    queryset = Room.objects.all()
    lookup_field = 'key'
    
    def get(self, request, *args, **kwargs):
        field = request.GET.get(self.lookup_field)
        if field:
            filter = {self.lookup_field: field}
            room = get_object_or_404(self.queryset, **filter)
            if room:
                return JsonResponse(self.serializer_class(room, context={'request': request}).data, status=status.HTTP_200_OK)
        return JsonResponse({'message': f'Please provide "{self.lookup_field}".'}, status=status.HTTP_400_BAD_REQUEST)
        
class CreateRoomView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreateRoomSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            room = Room.objects.create(host=self.request.user, **serializer.data)
            return JsonResponse(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        
class GetRoomSettingsView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RoomSettingsSerializer
    lookup_field = 'key'
    
    def get(self, request, *args, **kwargs):
        field = request.GET.get(self.lookup_field)
        if field:
            filter = {self.lookup_field: field}
            queryset = Room.objects.filter(**filter)
            if queryset.exists():
                room = queryset[0]
                return JsonResponse(self.serializer_class(room).data, status=status.HTTP_200_OK)
        return JsonResponse({'message': f'Please provide "{self.lookup_field}".'}, status=status.HTTP_400_BAD_REQUEST)

class UpdateRoomSettingsView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RoomSettingsSerializer
    lookup_field = 'key'
    
    def put(self, request, *args, **kwargs):
        room_key = request.data.get(self.lookup_field)
        serializer = self.serializer_class(data=request.data, partial=True)
        
        if not serializer.is_valid():
            return JsonResponse({'error': 'Could not validate data.'})
        
        queryset = Room.objects.filter(key=room_key)
        if not queryset.exists():
            return JsonResponse({'error': f'Room not found with given key {room_key}'})
        
        room = queryset[0]
        room = serializer.update(room, serializer._validated_data)
        send_room(room, request)
        return JsonResponse({'success': f'Updated room setting ({room.key})', 'settings': RoomSettingsSerializer(room).data})
    
class MyRoomsView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RoomSerializer
    
    def get_queryset(self):
        return Room.objects.filter(host=self.request.user)

class PublicRoomsView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RoomSerializer
    
    def get_queryset(self):
        return Room.objects.filter(is_public=True).exclude(banned_users__in=[self.request.user])

class JoinRoomView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request, *args, **kwargs):
        room_key = request.data.get('room_key')
        room = Room.objects.get(key=room_key)

        if room.joined_users.contains(request.user):
            return JsonResponse({'success': ''})
        
        if int(room.joined_users.count()) >= room.max_users:
            return JsonResponse({'error': 'Room is full.'})
        
        user = request.user
        user_joined_rooms = user.get_joined_rooms()
        if len(user_joined_rooms) > 0:
            return JsonResponse({'error': f'You need to leave room {user_joined_rooms[0].key}'})
        
        room.joined_users.add(user)
        send_room(room, request)
        
        return JsonResponse({'success': f'Joined room {room.key}'})

class LeaveRoomView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request, *args, **kwargs):
        room_key = request.data.get('room_key')
        room = Room.objects.get(key=room_key)
        
        user = request.user
        room.joined_users.remove(user)
        send_room(room, request)
        
        return JsonResponse({'success': f'Joined room {room.key}'})

class KickUserView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request, *args, **kwargs):
        room_key = request.data.get('key')
        room = Room.objects.get(key=room_key)
        
        user_id = request.data.get('id')
        user = get_user_model().objects.get(id=user_id)
        room.joined_users.remove(user)
        send_room(room, request)
        
        return JsonResponse({'success': f'Kicked {user.username} from room.'})
    
class BanUnbanUserView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request, *args, **kwargs):
        room_key = request.data.get('key')
        room = Room.objects.get(key=room_key)
        
        user_id = request.data.get('id')
        user = get_user_model().objects.get(id=user_id)
        
        operation = request.data.get('operation')
        if operation == 'ban':
            room.banned_users.add(user)
            room.joined_users.remove(user)
        elif operation == 'unban':
            room.banned_users.remove(user)
            
        send_room(room, request)
        
        return JsonResponse({'success': f'{operation.capitalize()}ned {user.username} for room.'})


def send_room(room, request):
    channel_group_name = 'room_%s' % room.key
    channel_layer = get_channel_layer()
    serialized_room = RoomSerializer(room, context={'request': request}).data
    async_to_sync(channel_layer.group_send)(
        channel_group_name,
        {
            'type': 'room',
            'data': serialized_room
        }
    )

def send_room_users(room, request):
    channel_group_name = 'room_%s' % room.key
    channel_layer = get_channel_layer()
    joined_users = UserSerializer(room.joined_users, many=True, context={'request': request}).data
    banned_users = UserSerializer(room.banned_users, many=True, context={'request': request}).data
    async_to_sync(channel_layer.group_send)(
        channel_group_name,
        {
            'type': 'room_users',
            'data': {'joined': joined_users, 'banned': banned_users}
        }
    )