# Secure Authentication System 🔐

A secure backend authentication system that supports user registration, login, logout, protected profile access, and password recovery using forgot and reset password functionality.

This project focuses on implementing real-world authentication and security best practices.

---

##  Features

- User Registration
- User Login
- User Logout
- Protected Get Profile API
- Forgot Password (Email-based)
- Reset Password (Token-based)
- JWT Authentication & Authorization
- Password Hashing for Security

---

##  Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Token)
- Nodemailer
- Ethereal Email (for testing emails)
- Postman (API testing)

---

##  Security Implementation

- Passwords are stored using hashing
- JWT is used for authentication
- Protected routes are secured using middleware
- Reset password uses time-limited secure tokens
- Sensitive data is stored in environment variables

---

##  Email Testing

During development, **Ethereal Email** was used to test the forgot and reset password functionality.  
This allows safe testing without sending real emails.

In production, this can be replaced with services like:
- Gmail SMTP
- SendGrid
- AWS SES

---

##  API Testing

All APIs were tested using **Postman**, including:
- Successful requests
- Authentication-protected routes
- Error cases (invalid credentials, expired tokens)










