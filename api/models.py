from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Project(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField(default="", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.title

class Todo(models.Model):
    title = models.CharField(max_length=120)
    note = models.TextField(default="", blank=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='todos')

    def __str__(self):
        return self.title