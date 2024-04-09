const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;
//const PORT = config.server.port;
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let userData = [];

const crypto = require('crypto');

// Generate a random secret key
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Print the generated secret key
console.log("the key is :"+generateSecretKey());
// Use express-session middleware
app.use(session({
  secret: '30b88f7e20cd2a3c6b01a3e9659e0cf4eaf2e84617d50e0f215a3d980d58bf24',
  resave: false,
  saveUninitialized: true
}));

// Serve static files (HTML, CSS, etc.) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'web.html'));
});

// Route to serve the cooking items page
app.get('/cooking', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cooking.html'));
});

// Route to serve the purchase page
app.post('/purchase', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'purchase.html'));
});


function writeUserData(userData) {
  // Code to write user data to a file or database goes here
  console.log("Writing user data:", userData);
}

// Example usage of writeUserData function
// writeUserData({ username: "example", email: "example@example.com" });
// Route to serve the home page
// app.get('/home', (req, res) => {
//   if (req.session && req.session.userId) {
     
//      const newUser = req.body; // Assuming the request body contains user data
//    userData.push(newUser);
//    writeUserData();
//    res.sendFile(path.join(__dirname, 'public', 'web.html'));
//   }
//   else {
//     res.redirect('/signin');
//   }
//  });

// Route to serve the register page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signin.html'));
});

// Route to serve the contact page
app.get('/help', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'help.html'));
});

// Route to serve the contact page
app.get('/aboutus', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'aboutus.html'));
});

// Route to serve the contact page
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Route to serve the contact page
app.get('/billpayment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'billpayment.html'));
});

// Route to serve the contact page
app.get('/resetpassword', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'resetpassword.html'));
});


const fs = require('fs');

// Read database credentials from config.json
const config = JSON.parse(fs.readFileSync('config.json'));

const dbConfig = {
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
};

const mysql = require('mysql');

// Create MySQL database connection
const connection = mysql.createConnection(dbConfig);

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});


connection.query('SELECT * FROM register', (err, results) => {
  if (err) {
    console.error('Error executing query:', err);
    return;
  }
  console.log('Query results:', results);
});


// Serve registration form
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/registrationpage.html');
});

// Register endpoint
app.post('/register', (req, res) => {
  const { username ,email, password } = req.body;
  
  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).send('Error hashing password');
      return;
    }

    // Insert user details into the database
    const sql = 'INSERT INTO register (username,email,password) VALUES (?, ?, ?)';
    connection.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Error registering user');
        return;
      }
      console.log('User registered successfully');
      res.redirect('/signin');
    });
  });
});


// Serve sign-in form
app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signin.html'));
});

// Sign-in endpoint
app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  // Retrieve user from database by email
  const sql = 'SELECT * FROM register WHERE email = ?';
  connection.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (results.length === 0) {
      res.status(401).send('User not found');
      return;
    }
    const user = results[0];


    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      if (result) {
        // Passwords match, user authenticated
        req.session.userId = user.id;
        res.redirect('/home');
      } else {
        // Passwords don't match
        res.status(401).send('Invalid email or password');
      }
    });
  });
});

// Home page
app.get('/home', (req, res) => {
//   // Check if user is authenticated
 if (req.session && req.session.userId) {
    const newUser = req.body; // Assuming the request body contains user data
    userData.push(newUser);
    writeUserData();
    res.sendFile(path.join(__dirname, 'public', 'web.html'));
  } else {
     res.redirect('/signin');
   }
 });

 const nodemailer = require('nodemailer');
// Fetch registered emails from register table
function fetchRegisteredEmails() {
  return new Promise((resolve, reject) => {
    connection.query('SELECT email FROM register', (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results.map((row) => row.email));
    });
  });
}

// Fetch task details from task table
function fetchTaskDetails() {
  return new Promise((resolve, reject) => {
    connection.query('SELECT task, due_date FROM task', (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });
}

// Send alert emails to registered users based on task details
async function sendAlertEmails() {
  try {
    // Fetch registered emails
    const registeredEmails = await fetchRegisteredEmails();
    // Fetch task details
    const taskDetails = await fetchTaskDetails();
    
    // Create a Nodemailer transporter using SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your_email@gmail.com', // Your Gmail address
        pass: 'your_password' // Your Gmail password
      }
    });

    // Iterate over task details and send alert emails
    taskDetails.forEach((task) => {
      const { task: taskName, due_date: dueDate } = task;
      const message = `Task: ${taskName}\nDue Date: ${dueDate}`;
      
      registeredEmails.forEach((email) => {
        sendEmail(transporter, email, message);
      });
    });
  } catch (error) {
    console.error('Error sending alert emails:', error);
  }
}

// Function to send email
function sendEmail(transporter, email, message) {
  // Email message options
  let mailOptions = {
    from: 'your_email@gmail.com', // Sender email address
    to: email, // Recipient email address
    subject: 'Alert: New Task Reminder', // Subject line
    text: message // Plain text body
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Schedule sending alert emails (you can adjust the timing as per your requirement)
const intervalInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours
setInterval(sendAlertEmails, intervalInMilliseconds);

 
 

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });