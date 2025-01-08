var app = angular.module('todoApp', []);
app.controller('todoController', function($scope, $http) {
    const todoAPIURL = '/api/todo';
    const projectAPIURL = '/api/project';

    const todoDetailModal = new bootstrap.Modal(document.getElementById('todoDetailModal'), {});
    const projectDetailModal = new bootstrap.Modal(document.getElementById('projectDetailModal'), {});

    const loadAllProject = function() {
        $http.get(projectAPIURL).then(function(response) {
            $scope.projectList = response.data;
        });
    }
    loadAllProject();

    $scope.loadProjectTodo = function(project) {
        $http.get(`${projectAPIURL}/${project.id}/get_todos`).then(function(response) {
            project.todoList = response.data;
        });
    }

    $scope.showModalCreateNewTodo = function(project) {
        $scope.newTodo = {
            title: '',
            note: '',
        };
        $scope.modalData = {
            project: project,
            isUpdate: false
        }
        todoDetailModal.show();
    }

    $scope.createTodo = function() {
        const todo = {
            title: $scope.newTodo.title,
            note: $scope.newTodo.note,
            project: $scope.modalData.project.id,
        }

        $http.post(todoAPIURL + '/', todo).then(function(_) {
            $scope.loadProjectTodo($scope.modalData.project);
            todoDetailModal.hide();
        });
    }

    $scope.changeStatus = function(todo) {
        todo.completed = !todo.completed;
        $http.put(`${todoAPIURL}/${todo.id}/`, todo).then(function(_) {});
    }

    $scope.showModalEditTodo = function(todo, project) {
        $scope.newTodo = angular.copy(todo);
        $scope.modalData = {
            project: project,
            isUpdate: true
        }
        todoDetailModal.show();
    }

    $scope.updateTodo = function() {
        $http.put(`${todoAPIURL}/${$scope.newTodo.id}/`, $scope.newTodo).then(function(_) {
            $scope.loadProjectTodo($scope.modalData.project);
            todoDetailModal.hide();
        });
    }

    $scope.deleteTodo = function(todo, project) {
        $http.delete(`${todoAPIURL}/${todo.id}/`).then(function(_) {
            $scope.loadProjectTodo(project);
        });
    }

    $scope.showModalCreateNewProject = function() {
        console.log('showModalCreateNewProject pressed');
        $scope.newProject = {
            title: '',
            description: '',
        };
        $scope.modalData = {
            isUpdate: false
        }
        projectDetailModal.show();
    }

    $scope.createProject = function() {
        const project = {
            title: $scope.newProject.title,
            description: $scope.newProject.description,
        }

        $http.post(projectAPIURL + '/', project).then(function(_) {
            loadAllProject();
            projectDetailModal.hide();
        });
    }

    $scope.showModalEditProject = function(project) {
        $scope.newProject = angular.copy(project);
        $scope.modalData = {
            isUpdate: true
        }
        projectDetailModal.show();
    }

    $scope.updateProject = function() {
        $http.put(`${projectAPIURL}/${$scope.newProject.id}/`, $scope.newProject).then(function(_) {
            loadAllProject();
            projectDetailModal.hide();
        });
    }

    $scope.deleteProject = function(project) {
        $http.delete(`${projectAPIURL}/${project.id}/`).then(function(_) {
            loadAllProject();
        });
    }

});