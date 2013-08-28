var users;
var tasks;
var tasksLength;
$(document).ready(function()
{
    start();
    //----------------------------------------------click on the table
    $("#tasksTable").on("click", "button", function(e){
        var id = $(this).parent().parent()[0].id; 
        switch($(this).text())  
        {
            case "Show Task": showTask(id);
            break;
            case "Edit Task": editTask(id);
            break;
            default: deleteTask(id);
      }
    });
    
    //-------------------------------------------back from show form
    $("#backShow").click(function(){
        toggleAndClear("#showDiv","#tableDiv","#showForm");
        });
    
    
        //-------------------------------------------back from show form
        $("#backEdit").click(function(){
        toggleAndClear("#editDiv","#tableDiv","#editForm");
        })
        
        //------------------------------------------back from add
        $("#backAdd").click(function(){
        toggleAndClear("#addDiv","#tableDiv","#addForm");
        })
        
        //-----------------------------------------an owner was chosen in the update form
        $("#editForm").on("change", "#owner", function(e){
            var id=e.currentTarget.value;
            var str=workersList(id);
            $("#assigned_to").html(str);
        });
        
        //-----------------------------------------an owner was chosen in the add form
        $("#addForm").on("click", "#aowner", function(e){
            var id=e.currentTarget.value;
            var str=workersList(id);
            $("#aassigned_to").html(str);
            $("#aassigned_to").removeAttr("disabled");
        });
        
        //------------------------------------------update details
        $("#updateEdit").click(function(e){
            e.preventDefault();
            var id=$("#hid").attr("value");
            var str="/tasks/"+id;
            var a=$("#description").value;
            $.ajax({ 
            type: "Put",
            url: str,
            dataType: 'json',
            data: {'task': {'assigned_to':$("#assigned_to").val(),'description':$("#description").val(),'name':$("#name").val(),'order':$("#order").val(),'owner':$("#owner").val(),'status':$("#status").val(),'created_at':$("#created_at").val(),'updated_at':$("#updated_at").val()}},
            success:function(res){
                tasks[id]=res;
                createTable(tasks);
                toggleAndClear("#editDiv","#tableDiv","#editForm");
           }     
        });
            
            });
        
        
        //----------------------------------------add a new task
            $("#subAdd").click(function(e){
            $.ajax({ 
            type: "Post",
            url: "/tasks/",
            dataType: 'json',
            data: {'task': {'assigned_to':$("#aassigned_to").val(),'description':$("#adescription").val(),'name':$("#aname").val(),'order':$("#aorder").val(),'owner':$("#oawner").val(),'status':$("#astatus").val(),'created_at':$("#acreated_at").val(),'updated_at':$("#aupdated_at").val()}},
            success:function(res){
                tasks[res.id]=res;
                createTable(tasks);
           }
        });
            toggleAndClear("#addDiv","#tableDiv","#addForm");
            });
        
        //----------------------------------------go to add a new task
        $("#btnAdd").click(function(){
            var content='<br><label for="name" >Name:</label>&nbsp;&nbsp;<input type="text" id="aname"  required/><br>'+
                        '<label for="description">Description:</label>&nbsp;&nbsp;<input type="text" id="adescription" "/><br>'+
                        '<label for="owner">Owner:</label>&nbsp;&nbsp;<select id="aowner" required >'+ownersList(null)+'</select><br>'+
                        '<label for="assigned_to">Assigned to:</label>&nbsp;&nbsp;<select id="aassigned_to"  disabled = "disabled" required></select><br>'+
                        '<label for="status">Status:</label>&nbsp;&nbsp;<input type="text" id="astatus"  required/><br>'+
                        '<label for="order">Order:</label>&nbsp;&nbsp;<input type="text" id="aorder"  required/><br>'+
                        '<label for="created_at">Created at:</label>&nbsp;&nbsp;<input type="text" id="acreated_at" required/><br>'+
                        '<label for="updated_at">Updated at:</label>&nbsp;&nbsp;<input type="text" id="aupdated_at"/>';
    $("#addForm").prepend(content);
    toggleAndClear("#addDiv","#tableDiv");
        });
    
    //-------------------------------------------filter by owner   
    $("#filterBy").change(function(){
        var str=$("#filterBy").val();
        createTable(tasks,str);
        $("#showAll").removeAttr("hidden");
    });
    
    //--------------------------------------------show all records
    $("#showAll").click(function(){
        createTable(tasks);
        $("#showAll").attr("hidden","hidden");
        });
    
    //-------------------------------find the task by its id
function findTaskById(id) {
    for (var task in tasks){
        var t=tasks[task];
        if (t.id==id){
           return t;
            break;
        }
    }
}


//-------------------------------find the owner by his id
function findOwnerById (id){
    for (var user in users){
        var u=users[user];
        if (u.id==id){
           return u.name;
            break;
        }
    }
   
}

//-------------------------------------find the worker by his id
function findWorkerById (id){
    for (var user in users){
        var u=users[user];
        if (u.id==id){
           return u.name;
            break;
        }
    }
}



//-----------------------------------------find status name
function findStatusById(id) {
    switch (id) {
        case 0: return "waiting"; break;
        case 1: return "started"; break;
        default: return "finished"; break;
    }
    return "";
}

//-----------------------------------------create the table
function createTable(tasks,id) {
    var tasksTable="<tr><th>Task Name</th><th>Task Order</th><th>Task Owner</th><th>Assigned To</th><th>Task Status</th><th>Show Task</th><th>Edit Task</th><th>Delete Task</th></tr>";
    tasksLength=0;
    for(var object in tasks){
        var obj=tasks[object];
        tasksLength++;
        if (obj.owner==id||id==null) {
            tasksTable+="<tr id="+obj.id+">"
            tasksTable+="<td>"+obj.name+"</td>";
            tasksTable+="<td>"+obj.order+"</td>";
            tasksTable+="<td>"+findOwnerById(obj.owner)+"</td>";
            tasksTable+="<td>"+findWorkerById(obj.assigned_to)+"</td>";
            tasksTable+="<td>"+findStatusById(obj.status)+"</td>";
            tasksTable+='<td><button class="tableButton showButton">Show Task</button></td>';
            tasksTable+='<td><button class="tableButton editButton">Edit Task</button></td>';
            tasksTable+='<td><button class="tableButton deleteButton">Delete Task</button></td></tr>';
        }
        }
        $("#tasksTable").html(tasksTable);
    }


//-------------------------------------------get the basic data
function start() {
    $.ajax({ 
    type: "GET",
    url: "/tasks",
    dataType: 'json',
    success:function(res){
            tasks=res[0];
            users=res[1];
            createTable(tasks);
            $("#filterBy").html(ownersList());
           }
           
           
        });
}

//----------------------------------------------show task details
function showTask(id) {
    toggleAndClear("#tableDiv","#showDiv");
    var content="<br>Name: "+tasks[id].name+"<br>"+
                "Description: "+tasks[id].descrioption+"<br>"+
                "Order: "+tasks[id].order+"<br>"+
                "Assigned to: "+findWorkerById(tasks[id].assigned_to)+"<br>"+
                "Owner: "+findOwnerById(tasks[id].owner)+"<br>"+
                "Status: "+findStatusById(tasks[id].status)+"<br>"+
                "Created at: "+tasks[id].created_at+"<br>"+
                "Updated at: "+tasks[id].updated_at+"<br>";
    $("#showForm").prepend(content);
}

//---------------------------------------------------owners list
function ownersList(id) {
    var str="";
    for (var user in users){
        var u=users[user];
        if (u.parent_id==null)
        {
            str+="<option ";
            if (u.id==id||id==null) {
                str+='selected="selected"';
                id=u.id;
            }
            str+=' value="'+u.id+'">'+u.name+'</option>';
        }
    }
    return str;
}

//---------------------------------------------------workers list
function workersList(id) {
    var str;
    var i=0;
    for (var user in users){
        var u=users[user];
        if (u.parent_id==id)
            str+="<option";
            if (i==0) {
                str+='selected="selected"';
            }
            str+=' value="'+u.id+">"+u.name+"</option>";
            i++;
    }
    return str;
}

//----------------------------------------------edit task details
function editTask(id) {
    toggleAndClear("#tableDiv","#editDiv");
    var content='<br><input type="hidden" id="hid" value="'+id+'"><label for="name" >Name:</label>&nbsp;&nbsp;<input type="text" id="name" value="'+tasks[id].name+'" required="required"/><br>'+
                       '<label for="description">Description:</label>&nbsp;&nbsp;<input type="text" id="description" value="'+tasks[id].description+'"/><br>'+
                       '<label for="owner">Owner:</label>&nbsp;&nbsp;<select id="owner" required="required">'+ownersList(tasks[id].owner)+'</select><br>'+
                       '<label for="assigned_to">Assigned to:</label>&nbsp;&nbsp;<select id="assigned_to" required="required">'+workersList(tasks[id].owner)+'</select><br>'+
                       '<label for="status">Status:</label>&nbsp;&nbsp;<input type="text" id="status" value="'+tasks[id].status+'" required="required"/><br>'+
                       '<label for="order">Order:</label>&nbsp;&nbsp;<input type="text" id="order" value="'+tasks[id].order+'" required="required"/><br>'+
                       '<label for="created_at">Created at:</label>&nbsp;&nbsp;<input type="text" id="created_at" value="'+tasks[id].created_at+'" required="required"/><br>'+
                       '<label for="updated_at">Updated at:</label>&nbsp;&nbsp;<input type="text" id="updated_at" value="'+tasks[id].updated_at+'"/>';
    $("#editForm").prepend(content);
}

//----------------------------------------------delete task details
function deleteTask(id) {
    var str="/tasks/"+id;
    $.ajax({ 
    type: "delete",
    url: str,
    dataType: 'json',
    success:function(){
        delete tasks[id];
        createTable(tasks);
           }     
        });
}

//--------------------------------------------------clear & toggle
function toggleAndClear(a,b,c) {
    if (c!=null)
        $(c).empty();
    $(a).toggle();
    $(b).toggle();
}
});

//-------------------------------find the task by its id
function findTaskById(id) {
    for (var task in tasks){
        var t=tasks[task];
        if (t.id==id){
           return t;
            break;
        }
    }
}


//-------------------------------find the owner by his id
function findOwnerById (id){
    for (var user in users){
        var u=users[user];
        if (u.id==id){
           return u.name;
            break;
        }
    }
   
}

//-------------------------------------find the worker by his id
function findWorkerById (id){
    for (var user in users){
        var u=users[user];
        if (u.id==id){
           return u.name;
            break;
        }
    }
}



//-----------------------------------------find status name
function findStatusById(id) {
    switch (id) {
        case 0: return "waiting"; break;
        case 1: return "started"; break;
        default: return "finished"; break;
    }
    return "";
}

//-----------------------------------------create the table
function createTable(tasks,id) {
    var tasksTable="<tr><th>Task Name</th><th>Task Order</th><th>Task Owner</th><th>Assigned To</th><th>Task Status</th><th>Show Task</th><th>Edit Task</th><th>Delete Task</th></tr>";
    tasksLength=0;
    for(var object in tasks){
        var obj=tasks[object];
        tasksLength++;
        if (obj.owner==id||id==null) {
            tasksTable+="<tr id="+obj.id+">"
            tasksTable+="<td>"+obj.name+"</td>";
            tasksTable+="<td>"+obj.order+"</td>";
            tasksTable+="<td>"+findOwnerById(obj.owner)+"</td>";
            tasksTable+="<td>"+findWorkerById(obj.assigned_to)+"</td>";
            tasksTable+="<td>"+findStatusById(obj.status)+"</td>";
            tasksTable+='<td><button class="tableButton showButton">Show Task</button></td>';
            tasksTable+='<td><button class="tableButton editButton">Edit Task</button></td>';
            tasksTable+='<td><button class="tableButton deleteButton">Delete Task</button></td></tr>';
        }
        }
        $("#tasksTable").html(tasksTable);
    }


//-------------------------------------------get the basic data
function start() {
    $.ajax({ 
    type: "GET",
    url: "/tasks",
    dataType: 'json',
    success:function(res){
            tasks=res[0];
            users=res[1];
            createTable(tasks);
            $("#filterBy").html(ownersList());
           }
           
           
        });
}

//----------------------------------------------show task details
function showTask(id) {
    toggleAndClear("#tableDiv","#showDiv");
    var content="<br>Name: "+tasks[id].name+"<br>"+
                "Description: "+tasks[id].descrioption+"<br>"+
                "Order: "+tasks[id].order+"<br>"+
                "Assigned to: "+findWorkerById(tasks[id].assigned_to)+"<br>"+
                "Owner: "+findOwnerById(tasks[id].owner)+"<br>"+
                "Status: "+findStatusById(tasks[id].status)+"<br>"+
                "Created at: "+tasks[id].created_at+"<br>"+
                "Updated at: "+tasks[id].updated_at+"<br>";
    $("#showForm").prepend(content);
}

//---------------------------------------------------owners list
function ownersList(id) {
    var str="";
    for (var user in users){
        var u=users[user];
        if (u.parent_id==null)
        {
            str+="<option ";
            if (u.id==id||id==null) {
                str+='selected="selected"';
                id=u.id;
            }
            str+=' value="'+u.id+'">'+u.name+'</option>';
        }
    }
    return str;
}

//---------------------------------------------------workers list
function workersList(id) {
    var str;
    var i=0;
    for (var user in users){
        var u=users[user];
        if (u.parent_id==id)
            str+="<option";
            if (i==0) {
                str+='selected="selected"';
            }
            str+=' value="'+u.id+">"+u.name+"</option>";
            i++;
    }
    return str;
}

//----------------------------------------------edit task details
function editTask(id) {
    toggleAndClear("#tableDiv","#editDiv");
    var content='<br><input type="hidden" id="hid" value="'+id+'"><label for="name" >Name:</label>&nbsp;&nbsp;<input type="text" id="name" value="'+tasks[id].name+'" required="required"/><br>'+
                       '<label for="description">Description:</label>&nbsp;&nbsp;<input type="text" id="description" value="'+tasks[id].description+'"/><br>'+
                       '<label for="owner">Owner:</label>&nbsp;&nbsp;<select id="owner" required="required">'+ownersList(tasks[id].owner)+'</select><br>'+
                       '<label for="assigned_to">Assigned to:</label>&nbsp;&nbsp;<select id="assigned_to" required="required">'+workersList(tasks[id].owner)+'</select><br>'+
                       '<label for="status">Status:</label>&nbsp;&nbsp;<input type="text" id="status" value="'+tasks[id].status+'" required="required"/><br>'+
                       '<label for="order">Order:</label>&nbsp;&nbsp;<input type="text" id="order" value="'+tasks[id].order+'" required="required"/><br>'+
                       '<label for="created_at">Created at:</label>&nbsp;&nbsp;<input type="text" id="created_at" value="'+tasks[id].created_at+'" required="required"/><br>'+
                       '<label for="updated_at">Updated at:</label>&nbsp;&nbsp;<input type="text" id="updated_at" value="'+tasks[id].updated_at+'"/>';
    $("#editForm").prepend(content);
}

//----------------------------------------------delete task details
function deleteTask(id) {
    var str="/tasks/"+id;
    $.ajax({ 
    type: "delete",
    url: str,
    dataType: 'json',
    success:function(){
        delete tasks[id];
        createTable(tasks);
           }     
        });
}

//--------------------------------------------------clear & toggle
function toggleAndClear(a,b,c) {
    if (c!=null)
        $(c).empty();
    $(a).toggle();
    $(b).toggle();
}


