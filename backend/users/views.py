from django.http import JsonResponse

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

from users.models import AppUser as UserModel
from users.serializers import UserSerializer


class UsersView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    
class CurrentUserView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get(self, request, format=None):
        #response = UserModel.objects.get(user=request.user)
        return JsonResponse(self.serializer_class(request.user).data)