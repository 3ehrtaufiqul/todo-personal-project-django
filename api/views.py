from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from api.serializers import ProjectSerializer, TodoSerializer

from .models import Project, Todo
from .permissions import EditOwnerOnly

# def index(request):
#     return HttpResponse("Hello, world. You're at the todo index.")

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class TodoViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    lookup_field = 'id'

    # def perform_create(self, serializer):
    #     # Use perform_create hook to associate the todo with the user that created it before saving it to the database.
    #     try:
    #         serializer.save(user=self.request.user)
    #     except ValueError:
    #         serializer.save()