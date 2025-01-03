from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from api.serializers import TodoSerializer

from .auth.permissions import EditOwnerOnly
from .models import Todo

# def index(request):
#     return HttpResponse("Hello, world. You're at the todo index.")

class TodoList(generics.ListCreateAPIView):
    "List all todos or create a new todo."
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

    def perform_create(self, serializer):
        # Use perform_create hook to associate the todo with the user that created it before saving it to the database.
        serializer.save(user=self.request.user)

class TodoDetail(generics.RetrieveUpdateDestroyAPIView):
    "Retrieve, update, or delete a todo."
    permission_classes = [IsAuthenticatedOrReadOnly, EditOwnerOnly]
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    lookup_field = 'id'