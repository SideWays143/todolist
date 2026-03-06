# todolist
A full-stack task management web application built using HTML, CSS, JavaScript (jQuery), AWS Lambda, API Gateway, and MySQL (Amazon RDS).
The application allows users to create an account, securely log in, and manage personal tasks with priority levels. Tasks can be added, completed, and deleted while being organized into Pending and Completed sections.
The frontend communicates with a serverless backend using REST APIs hosted on AWS Lambda and API Gateway, which interact with a MySQL database on Amazon RDS.

## Live Demo
You can access the deployed application here:
https://to-do-list-ss.netlify.app/ 

## Features
### User Authentication
- User signup with username, email, and password
- Login authentication
- Token-based session management
- Logout functionality

### Task Management
- Add new tasks
- Set priority levels (High / Medium / Low)
- Mark tasks as completed
- Delete tasks with confirmation
- Separate lists for Pending and Completed tasks

### User Interface
- Responsive design
- Real-time updates using AJAX
- Success and error messages
- Clean task display with priorities

## Tech Stack
### Frontend
- HTML5
- CSS3
- JavaScript
- jQuery
- AJAX

### Backend
- Node.js
- AWS Lambda
- AWS API Gateway

### Database
- MySQL
- Amazon RDS

### Application Architecture
Frontend (HTML / CSS / JS / jQuery) ➡️ AJAX Requests ➡️ API Gateway ➡️ AWS Lambda ➡️ MySQL (Amazon RDS)

### API Endpoints
| Method | Endpoint      | Description              |
| ------ | ------------- | ------------------------ |
| POST   | /login        | Authenticate user        |
| POST   | /adduser      | Create new user          |
| GET    | /gettask      | Retrieve user tasks      |
| POST   | /addtask      | Add a new task           |
| PATCH  | /completetask | Mark a task as completed |
| DELETE | /deletetask   | Delete a task            |
| POST   | /logout       | Log out user             |

### Key Implementation Details
- Token-based authentication is used for protecting API routes.
- The frontend stores the authentication token in localStorage.
- API requests include the token in the Authorization header.
- Tasks are retrieved dynamically and rendered in the UI using jQuery and AJAX.

### Future Improvements
Possible improvements for the project:
- Password hashing with bcrypt
- JWT authentication
- Edit tasks
- Task due dates
- Improved UI/UX

## Author
### Saurav Singh

