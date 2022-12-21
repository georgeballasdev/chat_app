from django.urls import path
from .views import Login, logoutview, profileview

app_name = 'accounts'
urlpatterns = [
    path('', profileview, name='profile'),
    path('login/', Login.as_view(), name='login'),
    path('logout', logoutview, name='logout'),
]