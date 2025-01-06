var app = angular.module('todoApp', []);
app.controller('todoController', function($scope, $http) {
    const todoDetailModal = new bootstrap.Modal(document.getElementById('todoDetailModal'), {});

    const loadAll = function() {
        $http.get('/api/').then(function(response) {
            $scope.todoList = response.data;
        });
    }
    loadAll();

    $scope.changeStatus = function(todo) {
        todo.completed = !todo.completed;
        $http.put(`/api/${todo.id}/`, todo).then(function(_) {
            loadAll();
        });
    }

    $scope.newTodo = function() {
        $scope.newTodo = {};
        $scope.isNewTodo = true;
        todoDetailModal.show();
    }

    $scope.createTodo = function(todo) {
        $http.post('/api/', todo).then(function(_) {
            loadAll();
            todoDetailModal.hide();
        });
    }

    $scope.editTodo = function(todo) {
        $scope.newTodo = angular.copy(todo);
        $scope.isNewTodo = false;
        todoDetailModal.show();
    }

    $scope.updateTodo = function(todo) {
        $http.put(`/api/${todo.id}/`, todo).then(function(_) {
            loadAll();
            todoDetailModal.hide();
        });
    }

    $scope.deleteTodo = function(todo) {
        $http.delete(`/api/${todo.id}/`).then(function(_) {
            loadAll();
        });
    }

});