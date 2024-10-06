import { Link } from 'react-router-dom';
import React, { useState } from 'react';

interface ServerResponse {
    message?: string;
    error?: string;
    email?: string;
    username?: string;
    password?: string;
}

const SignUp: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Get env vars
    const PORT = process.env.REACT_APP_PORT || 5050;
    const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

    // Handle user sign in
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        const user = {
            email: email,
            username: username,
            password: password
        }

        const res = await fetch(`${SERVER_URL}/signup`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(user)
        });

        // Check if the response is successful
        if (!res.ok) {
            throw new Error('Internal server error');
        }
    
        const data: ServerResponse = await res.json(); // Expecting JSON response
    
        if (data.message) {
            console.log('Success:', data.message); // Success message from server
        } else if (data.error) {
            console.log('Error:', data.error); // Error message from server
        } else {
            console.log('New user created:', data); // The newly created user object
        }
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="bg-white p-12 w-full max-w-[400px] shadow-auth-card rounded-xl">
                <h2 className="text-2xl text-emerald-950 font-semibold m-0 mb-5">Create an Account</h2>
                <form onSubmit={(e) => handleSubmit(e)} className="">
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="auth-input"
                    />
                    <input
                        type="username"
                        id="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="auth-input"
                    />
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                    />
                    <button type="submit" className="w-full bg-green-400 text-white font-semibold p-3 my-4 rounded">Sign up</button>
                </form>
                <Link to="/login"
                    className="text-base m-0 text-emerald font-medium hover:underline hover:text-blue-800">
                        Already have an account? Sign in here.
                </Link>
            </div>
        </div>
    );
};

export default SignUp;