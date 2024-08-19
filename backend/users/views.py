from django.http import JsonResponse

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from django.conf.global_settings import AUTH_USER_MODEL
from django.contrib.auth import get_user_model
from users.serializers import UserSerializer

from chats.models import Message
from chats.serializers import MessageSerializer


class UsersView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    
class CurrentUserView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get(self, request, format=None):
        return JsonResponse(self.serializer_class(request.user).data)

class UserMessagesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    user_serializer_class = UserSerializer
    message_serializer_class = MessageSerializer
    lookup_field = 'user_id'
    
    def get(self, request, *args, **kwargs):
        if not request.data.get(self.lookup_field):
            return JsonResponse({'message': f'Please provide "{self.lookup_field}".'}, safe=False)
        
        field = request.data.get(self.lookup_field)
        user = get_user_model().objects.get(pk=field)
        messages = Message.objects.filter(sender=user)
        
        return JsonResponse({'user': self.user_serializer_class(user).data, 'messages': self.message_serializer_class(messages, many=True).data}, safe=False)