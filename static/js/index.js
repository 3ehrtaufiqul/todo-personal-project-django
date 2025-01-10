var app = angular.module('todoApp', []);
app.controller('todoController', function($scope, $http) {
    const todoAPIURL = '/api/todo';
    const projectAPIURL = '/api/project';

    const todoDetailModal = new bootstrap.Modal(document.getElementById('todoDetailModal'), {});
    const projectDetailModal = new bootstrap.Modal(document.getElementById('projectDetailModal'), {});
    $scope.activeFilter = {
        searchTitleInput: '',
        title: '',
    };

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

    const createTodo = function() {
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

    $scope.showModalCreateNewTodo = function(project) {
        $scope.newTodo = {
            title: '',
            note: '',
        };
        $scope.modalData = {
            project: project,
            isUpdate: false,
            submitFunction: createTodo
        }
        todoDetailModal.show();
    }

    $scope.changeStatus = function(todo) {
        todo.completed = !todo.completed;
        $http.put(`${todoAPIURL}/${todo.id}/`, todo).then(function(_) {});
    }

    const updateTodo = function() {
        $http.put(`${todoAPIURL}/${$scope.newTodo.id}/`, $scope.newTodo).then(function(_) {
            $scope.loadProjectTodo($scope.modalData.project);
            todoDetailModal.hide();
        });
    }

    $scope.showModalEditTodo = function(todo, project) {
        $scope.newTodo = angular.copy(todo);
        $scope.modalData = {
            project: project,
            isUpdate: true,
            submitFunction: updateTodo
        }
        todoDetailModal.show();
    }

    $scope.deleteTodo = function(todo, project) {
        $http.delete(`${todoAPIURL}/${todo.id}/`).then(function(_) {
            $scope.loadProjectTodo(project);
        });
    }

    const createProject = function() {
        const project = {
            title: $scope.newProject.title,
            description: $scope.newProject.description,
        }

        $http.post(projectAPIURL + '/', project).then(
            function(_) {
                loadAllProject();
                projectDetailModal.hide();
        })
        .catch(function(errorResponse) {
            switch (errorResponse.status) {
                case 400:
                    $scope.modalData.error.title = errorResponse.data[0];
                    break;
                default:
                    console.error(errorResponse);
            }
        });
    }

    $scope.showModalCreateNewProject = function() {
        $scope.newProject = {
            title: '',
            description: '',
        };
        $scope.modalData = {
            isUpdate: false,
            submitFunction: createProject,
            error: {}
        }
        projectDetailModal.show();
    }

    const updateProject = function() {
        $http.put(`${projectAPIURL}/${$scope.newProject.id}/`, $scope.newProject).then(function(_) {
            loadAllProject();
            projectDetailModal.hide();
        })
        .catch(function(errorResponse) {
            switch (errorResponse.status) {
                case 400:
                    $scope.modalData.error.title = errorResponse.data[0];
                    break;
                default:
                    console.error(errorResponse);
            }
        });
    }

    $scope.showModalEditProject = function(project) {
        $scope.newProject = angular.copy(project);
        $scope.modalData = {
            isUpdate: true,
            submitFunction: updateProject,
            error: {}
        }
        projectDetailModal.show();
    }

    $scope.deleteProject = function(project) {
        $http.delete(`${projectAPIURL}/${project.id}/`).then(function(_) {
            loadAllProject();
        });
    }

    $scope.applyFilter = function() {
        if ($scope.activeFilter.searchTitleInput === '') {
            return;
        }
        $scope.activeFilter.title = $scope.activeFilter.searchTitleInput;
        $http.get(`${projectAPIURL}/filter`, {params: {title: $scope.activeFilter.title}}).then(function(response) {
            $scope.projectList = response.data;
        });
    }

    $scope.clearFilter = function() {
        $scope.activeFilter.searchTitleInput = '';
        $scope.activeFilter.title = '';
        loadAllProject();
    }

    $scope.exportProjectToPDF = function() {
        $http.get(`${projectAPIURL}/report`, {responseType: 'blob'}).then(function(response) {
        // Create a new Blob object using the response data
        const file = new Blob([response.data], { type: 'application/pdf' });

        // Create a temporary URL for the Blob object
        const fileURL = URL.createObjectURL(file);

        // Create a temporary anchor element
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = 'project_report.pdf'; // The filename for the downloaded file

        // Append the anchor to the document (not required but recommended)
        document.body.appendChild(a);

        // Programmatically click the anchor to trigger the download
        a.click();

        // Clean up by removing the anchor and revoking the object URL
        document.body.removeChild(a);
        URL.revokeObjectURL(fileURL);
        });
    }

});