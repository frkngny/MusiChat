from django.http import JsonResponse

from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

from .serializers import CreateRoomSerializer, RoomSerializer
from .models import Room


class RoomsView(ListAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = RoomSerializer
    queryset = Room.objects.all()

class RoomView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'key'
    
    def get(self, request, *args, **kwargs):
        key = request.data.get(self.lookup_url_kwarg)
        if key:
            room = Room.objects.filter(key=request.data.get(self.lookup_url_kwarg))
            if room.exists():
                room = room[0]
                return JsonResponse(self.serializer_class(room).data, status=status.HTTP_200_OK)
        return JsonResponse({'message': ''}, status=status.HTTP_400_BAD_REQUEST)
        

class CreateRoomView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreateRoomSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            room = Room(host=self.request.user, **serializer.data)
            room.save()
            return JsonResponse(RoomSerializer(room).data, status=status.HTTP_201_CREATED)