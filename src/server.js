// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors'); // Import CORS
const bcrypt = require('bcrypt'); // Import bcrypt for hashing

const app = express();
const port = 3000;

// Use CORS to allow cross-origin requests
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to serve your index.html for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle POST requests to /signup
app.post('/signup', async (req, res) => {
    const newUser = req.body; // Get user data from request body

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        newUser.password = hashedPassword; // Replace the plaintext password with the hashed one

        // Read existing users from users.json
        fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ message: 'Server error.' });
            }

            let users = [];
            if (data) {
                users = JSON.parse(data); // Parse existing users if any
            }

            users.push(newUser); // Add new user

            // Write updated users list to users.json
            fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Failed to save user.' });
                }

                res.json({ message: 'Signup successful!' }); // Send success message
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error hashing password.' });
    }
});

// Handle POST requests to /login
app.post('/login', (req, res) => {
    const { email, password, role } = req.body; // Get login data from request body

    // Read existing users from users.json
    fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Server error.' });
        }

        if (!data) {
            return res.status(404).json({ message: 'No users found.' });
        }

        const users = JSON.parse(data); // Parse existing users

        // Find user by email
        const matchedUser = users.find(user => user.email === email && user.role === role);

        if (!matchedUser) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Compare the entered password with the stored hashed password
        bcrypt.compare(password, matchedUser.password, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords.' });
            }
            if (result) {
                // Passwords match
                res.json({ message: 'Login successful!', role: matchedUser.role });
            } else {
                // Passwords do not match
                res.status(401).json({ message: 'Invalid credentials.' });
            }
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
