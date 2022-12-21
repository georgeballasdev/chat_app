from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required(login_url='accounts:login')
def main(request):
    template = 'chat/home.html'
    context = {}
    return render(request, template, context)
