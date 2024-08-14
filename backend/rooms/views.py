from django.http import JsonResponse

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

from .serializers import CreateRoomSerializer, RoomSerializer
from .models import Room


class RoomsView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = RoomSerializer
    queryset = Room.objects.all()


class CreateRoomView(generics.CreateAPIView):
    serializer_class = CreateRoomSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            room = Room(host=self.request.user, **serializer.data)
            room.save()
            return JsonResponse(RoomSerializer(room).data, status=status.HTTP_200_OK)