from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import render

@login_required(login_url='accounts:login')
def main(request):
    friends = User.objects.exclude(id=request.user.id)
    template = 'chat/home.html'
    context = {'friends': friends}
    return render(request, template, context)
