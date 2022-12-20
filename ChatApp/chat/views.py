from django.shortcuts import render

def main(request):
    template = 'chat/home.html'
    context = {}
    return render(request, template, context)
