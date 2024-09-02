from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from django.conf.global_settings import AUTH_USER_MODEL
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist

from users.serializers import UserSerializer, ProfileSerializer
from users.models import Profile, UserFriendship

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

########################################################
######### Friendship
########################################################
class SendFriendshipView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        receiver_user_id = request.data.get('receiver_user_id')
        receiver_profile = Profile.objects.get(user=receiver_user_id)
        sender_profile = Profile.objects.get(id=request.user.profile.id)
        
        try:
            relation = UserFriendship.objects.get((Q(receiver=receiver_profile) & Q(sender=sender_profile)) | (Q(receiver=sender_profile) & Q(sender=receiver_profile)))
            return JsonResponse({'message': 'Request is already sent.', 'friendship': relation.status})
        except ObjectDoesNotExist:
            relation = UserFriendship.objects.create(sender=sender_profile, receiver=receiver_profile, status='sent')
        
        return JsonResponse({'success': 'Request is sent.', 'friendship': relation.status})

class RemoveFriendView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, *args, **kwargs):
        friend_user_id = request.data.get('friend_user_id')
        friend_profile = Profile.objects.get(user=friend_user_id)
        
        sender_profile = Profile.objects.get(id=request.user.profile.id)
        
        relation = UserFriendship.objects.get((Q(receiver=friend_profile) & Q(sender=sender_profile)) | (Q(receiver=sender_profile) & Q(sender=friend_profile)))
        relation.delete()
        
        return JsonResponse({'success': 'Removed friend.'})

class FriendshipRequestsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user)
        queryset = UserFriendship.objects.invitations_received(profile)
        result = list(map(lambda x: UserSerializer(x.sender.user).data, queryset))
        return JsonResponse(result, safe=False)

class AnswerFriendshipRequestView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        answer = request.data.get('answer')
        sender_user_id = request.data.get('sender_user_id')
        sender_profile = Profile.objects.get(user=sender_user_id)
        
        user_profile = Profile.objects.get(id=request.user.profile.id)
        
        relation = None
        try:
            relation = get_object_or_404(UserFriendship, sender=sender_profile, receiver=user_profile)
            if answer == 'accept':
                if relation.status == 'sent':
                    relation.status = 'accepted'
                    relation.save()
                elif answer == 'reject':
                    relation.delete()
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'There is no request.'})
        
        return JsonResponse({'success': 'Request is accepted', 'friendship': relation.status})