from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated

from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from .mixins import MultipleFieldLookupMixin

class ChatDetailView(MultipleFieldLookupMixin, RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatSerializer
    queryset = Chat.objects.all()
    lookup_fields = ['room__key', 'room_id']
    

class CreateChatView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():            
            chat = Chat(**serializer.data)
            chat.save()
        return JsonResponse(self.serializer_class(chat).data, status=status.HTTP_200_OK)


class CreateMessageView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return JsonResponse({}, status=status.HTTP_400_BAD_REQUEST)
        
        message = Message.objects.create(**serializer.data)
        
        return JsonResponse(self.serializer_class(message).data, status=status.HTTP_201_CREATED)

class MessageView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def get(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return JsonResponse({}, status=status.HTTP_400_BAD_REQUEST)
        
        message = get_object_or_404(Message, sender=request.user)
        
        return JsonResponse(self.serializer_class(message).data, status=status.HTTP_201_CREATED)