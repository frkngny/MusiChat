from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

router = routers.DefaultRouter()

urlpatterns = router.urls

urlpatterns += [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('rooms/', include('rooms.urls')),
    path('chats/', include('chats.urls')),
]
