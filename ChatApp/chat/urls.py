from django.urls import path
from . import views

app_name = 'chat'
urlpatterns = [
    path('', views.main, name='main'),
]