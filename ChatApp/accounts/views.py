from django.shortcuts import render, redirect, reverse
from django.contrib.auth import logout
from django.contrib.auth.views import LoginView, LogoutView, login_required



@login_required(login_url='accounts:login')
def logoutview(request):
    logout(request)
    return redirect('accounts:login')

@login_required(login_url='accounts:login')
def profileview(request):
    context = {}
    return render(request, 'accounts/profile.html', context)

class Login(LoginView):
    template_name = 'accounts/login.html'
    next_page = 'accounts:profile'
    redirect_authenticated_user = True