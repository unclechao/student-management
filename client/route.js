angular.module("student-management").run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        if (error === 'AUTH_REQUIRED') {
            $state.go('students');
        }
    });
});

angular.module('student-management').config(function($urlRouterProvider, $stateProvider, $locationProvider){
    $locationProvider.html5Mode(true);
    $stateProvider.state('students', {
        url:'/students',
        templateUrl:'client/students/views/students-list.html',
        controller:'StudentsListCtrl'
    }).state('studentEdit', {
        url:'/students/:studentId',
    templateUrl:'client/students/views/student-edit.html',
    controller:'StudentEditCtrl',
    resolve: {
        "currentUser": function ($meteor) {
            return $meteor.requireUser();
        }}
    }).state('employees', {
        url:'/employees',
    templateUrl:'client/students/views/students-list.html',
    controller:'StudentsListCtrl'
    }).state('employeeEdit', {
        url:'/employees/:employeeId',
    templateUrl:'client/students/views/student-edit.html',
    controller:'StudentEditCtrl',
    resolve: {
        "currentUser": function ($meteor) {
            return $meteor.requireUser();
        }}
    });
    $urlRouterProvider.otherwise("/students");
});
