from django.http import Http404
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from api.serializers import TodoSerializer

from .models import Todo

# def index(request):
#     return HttpResponse("Hello, world. You're at the todo index.")

class TodoList(APIView):
    "List all todos or create a new todo."

    def get(self, request):
        "List all todos."
        todos = Todo.objects.all()
        serializer = TodoSerializer(todos, many=True)
        return Response(serializer.data)

    def post(self, request):
        "Create a new todo."
        data = JSONParser().parse(request)
        serializer = TodoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TodoDetail(APIView):
    "Retrieve, update, or delete a todo."

    def get_object(self, id):
        "Retrieve a single todo."
        try:
            return Todo.objects.get(pk=id)
        except Todo.DoesNotExist:
            raise Http404

    def get(self, request, id):
        "Retrieve a single todo."
        todo = self.get_object(id)
        serializer = TodoSerializer(todo)
        return Response(serializer.data)

    def put(self, request, id):
        "Update a single todo."
        todo = self.get_object(id)
        data = JSONParser().parse(request)
        serializer = TodoSerializer(todo, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        "Delete a single todo."
        todo = self.get_object(id)
        todo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)