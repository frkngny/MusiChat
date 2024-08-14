from rest_framework import routers
from django.urls import path, include

from .views import CurrentUserView

router = routers.DefaultRouter()
router.root_view_name = 'Users'

urlpatterns = router.urls

urlpatterns += [
    path('currentuser', CurrentUserView.as_view(), name='current_user'),
    path('auth/', include('users.auth.urls')),
]
