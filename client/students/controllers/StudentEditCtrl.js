angular.module("student-management").controller("StudentEditCtrl", function($scope, $stateParams,$meteor,$location,$meteor) {
    $meteor.autorun($scope, function() {
        $scope.student=$meteor.object(students,$stateParams.studentId,false).subscribe('students');
    });
    $meteor.autorun($scope, function() {
        $scope.employee=$meteor.object(employees,$stateParams.employeeId,false).subscribe('employees');
    });

    var oldName = $scope.employee.Name;
    var oldAge = $scope.employee.Age;
    var oldInfo = $scope.employee.EmployeeInfo.map(function(cur){
        return {Info:cur.Info};
    });

    $scope.save = function() {
        //Add education info add into education info, stupid method.
        var exist = false;
        if(typeof($scope.student) !== "undefined"){
            for( key in $scope.student.EducationInfoAdd){
                //$scope.student.EducationInfoAdd中的key值如果在$scope.student.EducationInfo中存在则不去更新
                for(k in  $scope.student.EducationInfo){
                    if(k == key){
                        exist=true;
                    }
                }
                if(exist==false){
                    var tmp = $scope.student.EducationInfoAdd[key];
                    if(typeof($scope.student.EducationInfo) == "undefined"){
                        $scope.student.EducationInfo=new Object(); 
                    }
                    $scope.student.EducationInfo[key]=tmp;
                }
            }
        } 
        $scope.student.save();
        $location.path('/students');
    };
    $scope.reset = function() {
        $scope.student.reset();
    };

    $scope.updateEmployee = function (eid,employee) {
        var updateObj = {};
        if(oldName!==employee.Name){
            updateObj.Name=employee.Name;
        }else{
            updateObj.Name=oldName;
        }
        if(oldAge!==employee.Age){
            updateObj.Age=employee.Age;
        }else{
            updateObj.Age=oldAge;
        }
        updateObj.EmployeeInfo=employee.EmployeeInfo;
        console.log(updateObj.EmployeeInfo);
        $meteor.call('updateEmployee', eid,updateObj);
        $location.path('/employees');
    };
    $scope.removeEmployeeInfo = function(index){
        $scope.employee.EmployeeInfo.splice(index,1);
    };
    $scope.addEmployeeInfo = function(){
        if(typeof($scope.employee.EmployeeInfo) == "undefined"){
            $scope.employee.EmployeeInfo = [];
            $scope.employee.EmployeeInfo.push({Info:''});
        }
        else{
            $scope.employee.EmployeeInfo.push({Info:''});
        }
    }

}).directive("educationInfoDetail", function ($compile) {
    //添加信息按钮
    return{
        restrict: 'EA',scope:true,link: function(scope,element,attrs){
            scope.index=0;
            element.on("click", function(){
                scope.index=new Date().getMilliseconds();
                scope.$apply(function() {
                    $('.eduDiv').append($compile("<div class='form-group'><label>Info</label>"
                            +" <input ng-model='student.EducationInfoAdd["+scope.index+"].Info'> "
                            +"<label>Start Date</label>"
                            +" <input ng-model='student.EducationInfoAdd["+scope.index+"].StartDate'> "
                            +"<label>End Date</label>"
                            +" <input ng-model='student.EducationInfoAdd["+scope.index+"].EndDate'> "
                            +" <button remove-info-btn-detail-special class='btn btn-warning'>Remove</button></div>" )(scope));
                    scope.index++;
                });
            });
        }
    }
}).directive("removeInfoBtnDetail",function($compile){
    //删除原有的信息
    return {
        restrict:'EA',link:function(scope,element,attrs){
            element.on("click",function(){
                //find which is removed, delete newstudent.Educationinfo
                var info = element.siblings("input").eq(0).val();
                var startDate = element.siblings("input").eq(1).val();
                var endDate = element.siblings("input").eq(2).val();
                if(typeof(scope.student) !== "undefined"){
                    for( key in scope.student.EducationInfo){
                        var tmp = scope.student.EducationInfo[key];
                        if( (!tmp.Info || tmp.Info==info ) && (!tmp.StartDate || tmp.StartDate==startDate)
                            && (!tmp.EndDate || tmp.EndDate==endDate)){
                                delete scope.student.EducationInfo[key];    
                            }
                    }
                    for( key in scope.student.EducationInfoAdd){
                        var tmp = scope.student.EducationInfoAdd[key];
                        if( (!tmp.Info || tmp.Info==info ) && (!tmp.StartDate || tmp.StartDate==startDate)
                            && (!tmp.EndDate || tmp.EndDate==endDate)){
                                delete scope.student.EducationInfoAdd[key];    
                            }
                    } 
                }
                console.log(scope.student);
                scope.$apply(function() {
                    element.parent().remove();
                });                
            });
        }
    }
}).directive("removeInfoBtnDetailSpecial",function($compile){
    //删除通过detail页面添加的信息
    return {
        restrict:'EA',link:function(scope,element,attrs){
            element.on("click",function(){
                //find which is removed, delete newstudent.Educationinfo
                var info = element.siblings("input").eq(0).val();
                var startDate = element.siblings("input").eq(1).val();
                var endDate = element.siblings("input").eq(2).val();
                if(typeof(scope.student) !== "undefined"){
                    for( key in scope.student.EducationInfoAdd){
                        var tmp = scope.student.EducationInfoAdd[key];
                        if( (!tmp.Info || tmp.Info==info ) && (!tmp.StartDate || tmp.StartDate==startDate)
                            && (!tmp.EndDate || tmp.EndDate==endDate)){
                                delete scope.student.EducationInfoAdd[key];    
                            }
                    }  
                }
                scope.$apply(function() {
                    element.parent().remove();
                });                
            });
        }
    }
});

