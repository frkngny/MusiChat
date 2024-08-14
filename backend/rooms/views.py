from django.http import JsonResponse

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

from .serializers import RoomSerializer
from .models import Room
from users.models import AppUser as UserModel
from users.serializers import UserSerializer

class CreateRoom(generics.CreateAPIView):
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            room = Room(host=self.request.user, **serializer.data)
            room.save()
            return JsonResponse(self.serializer_class(room).data, status=status.HTTP_200_OK)