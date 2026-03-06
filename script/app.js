"use strict";

$(document).ready(function () {

//My End Point 
const endpoint = "https://wqphpflgyl.execute-api.us-east-1.amazonaws.com/default/todo-list";


//Functions

let clearLoginMessage = () => {
  setTimeout(() => {
    $("#logMessage").html("");
  }, 5000);
};

let clearSignupMessage = () => {
  setTimeout(() => {
    $("#signMessage").html("");
  }, 5000);
};

let clearaddMessage = () => {
  setTimeout(() => {
    $("#addMessage").html("");
  }, 5000);
};

let getAuthHeaders = () => {
    return {
        "Authorization": "Bearer " + localStorage.getItem("token")
    };
};

let loginController = () => {
	//clear any previous messages
	$('#logMessage').html("");

	//error trapping.
	let username = $("#username").val().trim();
	let password = $("#password").val().trim();
    

	if (username == "" || password == ""){
		$('#logMessage')
            .removeClass('success-message')
            .addClass('error-message')
            .html('The user name and password are both required.');
		clearLoginMessage();
		return; 
	}
	else{
		//using ajax to send data
		$.ajax({
			url: endpoint + "/login",
			method: "POST",
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify({username, password}),
			
			success: (result) => {
				if(result.success){
					localStorage.setItem("token", result.token);
					localStorage.setItem("username", result.user.username);
					$("#logMessage")
                        .removeClass('error-message')
                        .addClass('success-message')
                        .html(result.message);
					clearLoginMessage();
					window.location.href = "todo.html";
				}
				else {
					$("#logMessage").html(result.message || "Login failed.");
					$("#logMessage")
                        .removeClass('success-message')
                        .addClass('error-message')
                        .html(result.message);
					clearLoginMessage();
				}
			},
			error: (err) => {
				if(err.status === 401){
					alert("Session expired. Please login again.");
					localStorage.clear();
					window.location.replace("index.html");
				}
				$("#logMessage")
                        .removeClass('success-message')
                        .addClass('error-message')
						.html(err.responseJSON?.message || "Something went wrong");
				clearLoginMessage();

			}
		})
	}
}

let signupController = () => {
	//clear any previous messages
	$('#signMessage').html("");

	//error trapping.
	let username = $("#new-username").val().trim();
	let password = $("#new-password").val().trim();
    let email = $("#new-email").val().trim();
    

	if (username == "" || password == "" || email == ""){
		$('#signMessage').html('All fields are required.')
			.removeClass('success-message')
			.addClass('error-message');
		clearSignupMessage();
		return;    
	}
	else{
		$.ajax({
			url: endpoint + "/adduser",
			method: "POST",
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify({username, password, email}),
			success: (result) => {
				if(result.success){
					console.log("Signup successfull.");
					$("#signMessage").html(result.message);
					$("#signMessage")
                        .removeClass('error-message')
                        .addClass('success-message')
                        .html(result.message);
					clearSignupMessage();
				}
			},
			error: (err) => {
				if(err.status === 401){
					alert("Session expired. Please login again.");
					localStorage.clear();
					window.location.replace("index.html");
				}
				$("#signMessage")
                        .removeClass('success-message')
                        .addClass('error-message')
                        .html(err.responseJSON?.message || "Something went wrong");
				clearSignupMessage();
			}
		})
	}
}

let addtask = () => {
	//clear any previous messages
	$('#addMessage').html("");

	var token = localStorage.getItem("token");
	let task = $("#todoInput").val().trim();
    let priority = $("#priority").val();

	if(!token){
		alert("Session expired. Please login again.");
		window.location.replace("index.html");
		return;
	}

	if (!task|| priority == "select"){
		$('#addMessage').html('All fields are required.')
			.removeClass('success-message')
            .addClass('error-message');
		clearaddMessage();
		return;    
	}
	else{
		$.ajax({
			url: endpoint + "/addtask",
			method: "POST",
			headers: getAuthHeaders(),
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify({task, priority}),
			success: (result) => {
				if(result.success){
					console.log("Task added");
					$("#addMessage").html(result.message);
					$("#addMessage")
                        .removeClass('error-message')
                        .addClass('success-message')
                        .html(result.message);
					clearaddMessage();
					$("#todoInput").val("");
					$("#priority").val("select");
					getTask();
				}
			},
			error: (err) => {
				if(err.status === 401){
					alert("Session expired. Please login again.");
					localStorage.clear();
					window.location.replace("index.html");
				}
				$("#addMessage")
                        .removeClass('success-message')
                        .addClass('error-message')
                        .html(err.responseJSON?.message || "Something went wrong");
				clearaddMessage();
			}
		})
	}
}

let getTask = () => {

	var token = localStorage.getItem("token");

	if(!token){
		console.log("Token missing or need to login again")
		window.location.replace("index.html");
    return;
	}
	else{
		$.ajax({
			url: endpoint + "/gettask",
			method: "GET",headers: {
				"Authorization": "Bearer " + token
			},
			success: (result) => {
				if(result.success){
					$(".displayName").text("Welcome, " + localStorage.getItem("username"));
					$("#pendingUL").empty();
					$("#completedUL").empty();

					if(result.tasks.length === 0){
    					$("#pendingUL").html("<p>No tasks yet</p>");
						return;
					}

					result.tasks.forEach(task => {
						let status = task.status.trim().toLowerCase();

						let html = `
							<li>
								<span class="loadedTask">${task.task_title}</span>
								<span class="prio">${task.priority.toUpperCase()}</span>
								<div class="todo-actions">
									${status === "pending" 
									? `<button class="completeBtn" data-id="${task.id}">Complete</button>` 
									: ''
									}
									<button class="deleteBtn" data-id="${task.id}">Delete</button>
								</div>
							</li>
						`;

						if(status === "pending"){
							$("#pendingUL").append(html);
						}
						else if(status === "completed"){
							$("#completedUL").append(html);
						}
						else {
							console.log("Unknown status:", status);
						}
					});
				}
			},
			error: (err) => {
				if(err.status === 401){
					alert("Session expired. Please login again.");
					localStorage.clear();
					window.location.replace("index.html");
				}
			}
		})
	}
}

let markComplete = function () {
	//error trapping.
	let id = $(this).data("id");
	let token = localStorage.getItem("token");

	if(!token){
		alert("Session expired. Please login again.");
		window.location.replace("index.html");
		return;
	}

	if (!id){
		return; 
	}
	else{
		//using ajax to send data
		$.ajax({
			url: endpoint + "/completetask",
			method: "PATCH",
			headers: getAuthHeaders(),
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify({id}),
			
			success: (result) => {
				getTask();
			},
			error: (err) => {
				if(err.status === 401){
					alert("Session expired. Please login again.");
					localStorage.clear();
					window.location.replace("index.html");
				}
			}
		})
	}
}

let deleteTask = function () {
	//error trapping.
	let id = $(this).data("id");
	let token = localStorage.getItem("token");

	if(!token){
		alert("Session expired. Please login again.");
		window.location.replace("index.html");
		return;
	}

	if (!id){
		return; 
	}
	else{

		let confirmDelete = confirm("Are you sure you want to delete this task?");

		if(!confirmDelete) return;

		//using ajax to send data
		$.ajax({
			url: endpoint + "/deletetask",
			method: "DELETE",
			headers: getAuthHeaders(),
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify({id}),
			
			success: (result) => {
				getTask();
			},
			error: (err) => {
				if(err.status === 401){
					alert("Session expired. Please login again.");
					localStorage.clear();
					window.location.replace("index.html");
				}
			}
		})
	}
}

let logOut = () => {
    // localStorage.clear();
    // window.location.replace("index.html");
	let token = localStorage.getItem("token");

	if(!token){
		alert("Session expired. Please login again.");
		window.location.replace("index.html");
		return;
	}
	else{

		//using ajax to send data
		$.ajax({
			url: endpoint + "/logout",
			method: "POST",
			headers: getAuthHeaders(),
			complete: () => {
				localStorage.clear();
				window.location.replace("index.html");
			}
    	});
	}

}

//Click events

    $("#loginBtn").click ( () => {
        loginController();
    } );

    $("#logSignBtn").click ( () => {
        $("#login-div").hide();
        $("#signup-div").show();
    } );

    $("#signupBtn").click ( () => {
        signupController();
    } );

    $("#cancelBtn").click ( () => {
        $("#login-div").show();
        $("#signup-div").hide();
    } );

	$("#logoutBtn").click(() => {
		logOut();
	})

	if (window.location.pathname.includes("todo.html")) {
    	getTask();
	}

	$("#addBtn").click (() => {
		addtask();
	})

	$("#todologo").click(() =>{
		getTask();
	})

	$(document).on("click", ".completeBtn", function () {
    	markComplete.call(this);
	});

	$(document).on("click", ".deleteBtn", function () {

    	deleteTask.call(this);
	});

});