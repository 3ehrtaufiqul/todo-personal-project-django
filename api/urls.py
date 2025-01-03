from django.urls import path
from . import views

urlpatterns = [
    path('', views.TodoList.as_view(), name='todo_list'),
    path('<int:id>/', views.TodoDetail.as_view(), name='todo_detail'),
]