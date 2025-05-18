# 📢 Notification Service (Node.js + MongoDB)

This is a beginner-friendly notification service built with **Node.js**, **Express**, and **MongoDB**. It supports sending three types of notifications:
- Email
- SMS
- In-App

It also has retry logic for failed sends.

---

## 🚀 Features

- RESTful API (POST and GET)
- Email, SMS, and In-App simulation
- Retry mechanism for delivery failures
- MongoDB for persistent storage

---

## 📦 Requirements

- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) running locally

---

## 🔧 Installation

1. Clone the repository : git clone  
2. npm install : Install NODE
3. mongod : Start mongoDB locally(default runs on this : mongodb://127.0.0.1:27017/notifications)
4. npm start : Start the server (http://localhost:3000)

**Using HoppScotch.io , we can check for both the GET and POST request, which is working.**
    -->Select Method as "POST" and in Body Tab select application/json and then add the notification u want to send
        Eg:
        {
            "userId": 1,
            "message": "Hello from Hoppscotch!",
            "type": "email"
        }

        You will see an output :
        {
            "userId": 1,
            "message": "Hello from Hoppscotch!",
            "type": "email",
            "status": "sent",
            "timestamp": "2025-05-19T..."
        }

    -->Similarly to see all notifications, U can select method as "GET" and paste the link : http://localhost:3000/users/1/notifications . This will show all the notifications of User1 in the database. Same can be seen in mongoDB as well.
    


