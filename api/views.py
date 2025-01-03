from django.http import Http404
from rest_framework import generics, permissions, status
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from api.serializers import TodoSerializer

from .models import Todo

# def index(request):
#     return HttpResponse("Hello, world. You're at the todo index.")

class TodoList(generics.ListCreateAPIView):
    "List all todos or create a new todo."
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

    def perform_create(self, serializer):
        # Use perform_create hook to associate the todo with the user that created it before saving it to the database.
        serializer.save(user=self.request.user)

class TodoDetail(generics.RetrieveUpdateDestroyAPIView):
    "Retrieve, update, or delete a todo."
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    lookup_field = 'id'