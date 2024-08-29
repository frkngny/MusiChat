from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .serializers import CreateRoomSerializer, RoomSerializer
from .models import Room


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
                return JsonResponse(self.serializer_class(room).data, status=status.HTTP_200_OK)
        return JsonResponse({'message': f'Please provide "{self.lookup_field}".'}, status=status.HTTP_400_BAD_REQUEST)
        
class CreateRoomView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreateRoomSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            room = Room.objects.create(host=self.request.user, **serializer.data)
            return JsonResponse(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        
class MyRoomsView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RoomSerializer
    
    def get_queryset(self):
        return Room.objects.filter(host=self.request.user)

class PublicRoomsView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RoomSerializer
    
    def get_queryset(self):
        return Room.objects.filter(is_public=True)

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
        
        return JsonResponse({'success': f'Joined room {room.key}'})

class LeaveRoomView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request, *args, **kwargs):
        room_key = request.data.get('room_key')
        room = Room.objects.get(key=room_key)
        
        user = request.user
        room.joined_users.remove(user)
        
        return JsonResponse({'success': f'Joined room {room.key}'})