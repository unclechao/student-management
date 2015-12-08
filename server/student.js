Meteor.publish("students", function (options) {
    Counts.publish(this, 'numberOfStudents', students.find({}), { noReady: true });
    return students.find({},options);
});

Meteor.publish("employees", function (options) {
    Counts.publish(this, 'numberOfEmployees', employees.find({}), { noReady: true });
    return employees.find({},options);
});

Meteor.methods({
    addNewEmployee: function (newEmployee) {
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        var res = newEmployee.EmployeeInfo;
        newEmployee.EmployeeInfo=res.map(function(cur){
            return {Info:cur.Info};
        });
        employees.insert(newEmployee);
    },
    deleteEmployee: function (eid) {
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        employees.remove(eid);
    },
    updateEmployee: function(eid,updateObj){
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        var resEmployeeInfo = updateObj.EmployeeInfo.map(function(cur){
            return {Info:cur.Info};
        });
        employees.update(eid,{$set:{Name:updateObj.Name,Age:updateObj.Age,EmployeeInfo:resEmployeeInfo}});
    },
    editSaveEmployee: function (eid,editSaveEmployee) {
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        employees.update(eid,{$set:editSaveEmployee});
    }
});
