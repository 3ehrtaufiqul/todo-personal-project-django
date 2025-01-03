from django.http import Http404
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics

from api.serializers import TodoSerializer

from .models import Todo

# def index(request):
#     return HttpResponse("Hello, world. You're at the todo index.")

class TodoList(generics.ListCreateAPIView):
    "List all todos or create a new todo."
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

class TodoDetail(generics.RetrieveUpdateDestroyAPIView):
    "Retrieve, update, or delete a todo."
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    lookup_field = 'id'