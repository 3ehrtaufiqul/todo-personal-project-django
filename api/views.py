from django.http import HttpResponse
from django.shortcuts import render
from django.template.loader import render_to_string
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from xhtml2pdf import pisa

from api.serializers import ProjectSerializer, TodoSerializer

from .models import Project, Todo
from .permissions import EditOwnerOnly

# def index(request):
#     return HttpResponse("Hello, world. You're at the todo index.")

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    @action(detail=False, methods=['get'])
    def filter(self, request):
        title = request.GET.get('title')
        projects = Project.objects.filter(title__icontains=title)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def is_unique(self, request):
        title = request.GET.get('title')
        is_unique = not Project.objects.filter(title=title).exists()
        return Response(is_unique)

    @action(detail=True, methods=['get'])
    def get_todos(self, request, pk=None):
        todos = Todo.objects.filter(project=pk)
        serializer = TodoSerializer(todos, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        queryset = Project.objects.filter(title=serializer.validated_data['title'])
        if queryset.exists():
            raise ValidationError('Project with this title already exists.')
        serializer.save()

    def perform_update(self, serializer):
        queryset = Project.objects.filter(title=serializer.validated_data['title']).exclude(pk=self.get_object().pk)
        if queryset.exists():
            raise ValidationError('Project with this title already exists.')
        serializer.save()

    @action(detail=False, methods=['get'])
    def report(self, request):
        project_list = Project.objects.all()
        context = {'project_list': project_list}
        html = render_to_string('project_report.html', context)
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="project_report.pdf"'
        pisa.CreatePDF(html, dest=response)
        return response

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