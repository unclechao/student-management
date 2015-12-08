students=new Mongo.Collection("Student");
employees=new Mongo.Collection("Employee");

students.allow({
    insert:function(userId,stu){
        return userId&&stu.Name;
    },
    update:function(userId,stu){
        return userId&&stu.Name;
    },
    remove:function(userId,stu){
        return userId&&stu.Name;
    }
});
