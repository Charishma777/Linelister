// script.js
function addTask() {
    var taskInput = document.getElementById("taskInput");
    var reminderInput = document.getElementById("reminderInput"); // New reminder input field
    var taskList = document.getElementById("taskList");
    var taskText = taskInput.value.trim();
    var reminderTime = reminderInput.value; // Get the value of the reminder input field
    
    if (taskText === "") return;

    var li = document.createElement("li");
    li.textContent = taskText;

    if (reminderTime) { // Check if a reminder time is set
        var reminderDate = new Date(reminderTime);
        var currentTime = new Date();

        if (reminderDate > currentTime) { // Only set a reminder if it's in the future
            setTimeout(function() {
                alert("Reminder: " + taskText);
            }, reminderDate - currentTime);
        }
    }

    li.onclick = function() {
        li.classList.toggle("task-completed");
    };

    taskList.appendChild(li);
    taskInput.value = "";
    reminderInput.value = ""; // Reset reminder input field after adding task
}

//signin
document.addEventListener('DOMContentLoaded', function() {
    const signinForm = document.getElementById('signin-form');
    const errorMessage = document.getElementById('error-message');

    signinForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(signinForm);
        const formDataJson = Object.fromEntries(formData.entries());

        // Send a POST request to your server to authenticate the user
        fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJson)
        })
        .then(response => {
            if (response.ok) {
                // Redirect the user to the home page upon successful sign-in
                window.location.href = '/home';
            } else {
                // Display error message if sign-in fails
                errorMessage.textContent = 'Invalid email or password';
                errorMessage.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'An error occurred. Please try again later.';
            errorMessage.style.display = 'block';
        });
    });
});

//register
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Validate username
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();
    if (username === '') {
      alert('Please enter a username');
      return;
    }

    // Validate email
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate password
    const passwordInput = document.getElementById('password');
    const password = passwordInput.value.trim();
    if (password === '') {
      alert('Please enter a password');
      return;
    }

    // Submit the form if all inputs are valid
    form.submit();
  });
});

function search(){
    var searchInput = document.getElementById("searchInput");
    var searchButton = document.getElementById("searchButton");

    // Add event listeners or perform actions with the search bar element
    searchButton.addEventListener("click", function() {
        var searchTerm = searchInput.value;
        alert("Searching for: " + searchTerm);
        // Perform search functionality here
    });
}

function toggleDropdown() {
    var dropdownContent = document.getElementById("dropdownContent");
    dropdownContent.classList.toggle("show");

      // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
  }
  document.getElementById("redirectButton").addEventListener("click", function() {
    // Redirect to another web page
    window.location.href = "aboutus.html";
});
document.getElementById("register").addEventListener("click", function() {
    // Redirect to another web page
    window.location.href = "registrationpage.html";
});

function addTask() {
    var taskInput = document.getElementById("taskInput").value;
    var taskText = taskInput.value.trim();
    if (taskText === "") return;

    var li = document.createElement("li");
    li.textContent = taskText;

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function() {
        li.remove();
    };
    li.appendChild(deleteButton);

    var completeButton = document.createElement("button");
    completeButton.textContent = "Complete";
    completeButton.onclick = function() {
        li.style.textDecoration = "line-through";
    };
    li.appendChild(completeButton);

    document.getElementById("taskList").appendChild(li);
    taskInput.value = "";
}
