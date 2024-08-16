from django.http import JsonResponse

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

from .models import Chat
from .serializers import ChatSerializer
from rooms.models import Room


class ChatView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatSerializer
    
    def get(self, request, *args, **kwargs):
        room_key = request.GET.get('room_key')
        if room_key is None:
            return JsonResponse({}, status=status.HTTP_400_BAD_REQUEST)
        
        chat = Chat.objects.filter(room__key=room_key)
        if not chat.exists():
            return JsonResponse({'Chat does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        
        return JsonResponse(self.serializer_class(chat[0]).data, status=status.HTTP_200_OK)

class CreateChatView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():            
            chat = Chat(**serializer.data)
            chat.save()
        return JsonResponse(self.serializer_class(chat).data, status=status.HTTP_200_OK)
        