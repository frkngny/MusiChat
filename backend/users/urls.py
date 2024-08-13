from rest_framework import routers
from django.urls import path

from .views import CurrentUserView, UserTokenObtainPairView, RegisterView
from rest_framework_simplejwt.views import TokenRefreshView

router = routers.DefaultRouter()
router.root_view_name = 'Users'

urlpatterns = router.urls

urlpatterns += [
    path('currentuser', CurrentUserView.as_view(), name='current_user'),
    path('token', UserTokenObtainPairView.as_view(), name='user_token'),
    path('token-refresh', TokenRefreshView.as_view(), name='user_token_refresh'),
    path('register', RegisterView.as_view(), name='register'),
]
