from django.contrib import admin

from django.contrib.auth import get_user_model
from .models import Profile, UserFriendship

admin.site.register(get_user_model())
admin.site.register(Profile)
admin.site.register(UserFriendship)