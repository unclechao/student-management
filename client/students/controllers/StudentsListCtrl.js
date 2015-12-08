angular.module('student-management').controller('StudentsListCtrl', function ($scope, $meteor) {
    $scope.page = 1;
    $scope.perPage = 3;
    $scope.sort = {Name: 1};

    $meteor.autorun($scope, function() {
        $meteor.subscribe('students', {
            limit: parseInt($scope.getReactively('perPage')),
            skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
            sort: $scope.getReactively('sort')
        }).then(function(){
            $scope.studentsCount = $meteor.object(Counts ,'numberOfStudents', false);
        });
    });
    $meteor.autorun($scope, function() {
        $meteor.subscribe('employees', {
            limit: parseInt($scope.getReactively('perPage')),
            skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
            sort: $scope.getReactively('sort')
        }).then(function(){
            $scope.employeesCount = $meteor.object(Counts ,'numberOfEmployees', false);
        });
    });

    $scope.students = $meteor.collection(function() {
        return students.find({}, {
            sort : $scope.getReactively('sort')
        });
    });
    $scope.employees = $meteor.collection(function() {
        return employees.find({}, {
            sort : $scope.getReactively('sort')
        });
    });
    $scope.save = function(newStudent){
        $scope.students.save(newStudent);
    }
    $scope.remove = function(student){
        $scope.students.remove(student);
    };
    $scope.removeAll = function(){
        $scope.students.remove();
    };
    $scope.pageChanged = function(newPage) {
        $scope.page = newPage;
    };
    $scope.hasChild=function(){
        return $("#eduDiv").children().length<=0;  
    };


    $scope.addNewEmployeeInfo = function(){
        if(typeof($scope.newEmployee.EmployeeInfo) == "undefined"){
            $scope.newEmployee.EmployeeInfo = [];
            $scope.newEmployee.EmployeeInfo.push({Info:''});
        }
        else{
            $scope.newEmployee.EmployeeInfo.push({Info:''});
        }
    }
    $scope.addNewEmployee = function (newEmployee) {
        $meteor.call('addNewEmployee', newEmployee);
    };
    $scope.deleteEmployee = function (eid) {
        $meteor.call('deleteEmployee', eid);
    };
    $scope.removeNewEmployeeInfo = function(index){
        $scope.newEmployee.EmployeeInfo.splice(index,1);
    }
    $scope.editEmployee = function(eid){
        //find employee in db
        //set newEmployee = editemployee
        var res=employees.find({_id:eid}).fetch();
        $scope.newEmployee=res[0];
    }
    $scope.editSaveEmployee = function (editSaveEmployee) {
        console.log(editSaveEmployee);
        var resEmployeeInfo = editSaveEmployee.EmployeeInfo.map(function(cur){
            return {Info:cur.Info};
        });
        editSaveEmployee.EmployeeInfo = resEmployeeInfo;
        $meteor.call('editSaveEmployee',editSaveEmployee._id, editSaveEmployee);
    };
}).directive("educationInfo", function ($compile) {
    return{
        restrict: 'EA',scope:true,link: function(scope,element,attrs){
            scope.index=0;
            element.on("click", function() {
                scope.$apply(function() {
                    $('.eduDiv').append($compile("<div class='form-group'><label>Info</label>"
                            +" <input ng-model='newStudent.EducationInfo["+scope.index+"].Info'> "
                            +"<label>Start Date</label>"
                            +" <input ng-model='newStudent.EducationInfo["+scope.index+"].StartDate'> "
                            +"<label>End Date</label>"
                            +" <input ng-model='newStudent.EducationInfo["+scope.index+"].EndDate'> "
                            +" <button remove-info-btn class='btn btn-warning'>Remove</button></div>" )(scope));
                    scope.index++;
                });
            });
        }
    }
}).directive("removeInfoBtn",function($compile){
    return {
        restrict:'EA',link:function(scope,element,attrs){
            element.on("click",function(){
                //find which is removed, delete newstudent.Educationinfo
                var info = element.siblings("input").eq(0).val();
                var startDate = element.siblings("input").eq(1).val();
                var endDate = element.siblings("input").eq(2).val();
                if(typeof(scope.newStudent) !== "undefined"){
                    for( key in scope.newStudent.EducationInfo){
                        var tmp = scope.newStudent.EducationInfo[key];
                        if( (!tmp.Info || tmp.Info==info ) && (!tmp.StartDate || tmp.StartDate==startDate)
                            && (!tmp.EndDate || tmp.EndDate==endDate)){
                                delete scope.newStudent.EducationInfo[key];    
                            }
                    }  
                }
                scope.$apply(function() {
                    element.parent().remove();
                });                
            });
        }
    }
}).directive("removeAllEducationInfo",function(){
    return {
        restrict:'EA',link:function(scope,element,attrs){
            element.on("click",function(){
                if(typeof(scope.newStudent) !== "undefined"){
                    delete scope.newStudent.EducationInfo;   
                }
                $("#eduDiv").empty();
            })
        }
    }
});
