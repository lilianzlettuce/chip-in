import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

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
    const [msg, setMsg] = useState('');

    const navigate = useNavigate();

    // Get server url
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

        // Send auth request to server
        const res = await fetch(`${SERVER_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(user)
        });

        // Get JSON response from server and display message
        const data: ServerResponse = await res.json();
        if (data.message) {
            alert("Success! Log in now.");
            navigate("/login");
            //setMsg(data.message);
        } else if (data.error) {
            setMsg(data.error);
        }
    };

    useEffect(() => {
        // Check if token exists
        let token = localStorage.getItem("token");
        if (!token) {
            console.log("no token supplied");
            return;
        }

        // Redirect to profile if user is signed in
        fetch(`${SERVER_URL}/auth/getUserData`, {
            headers: {
                "x-access-token": token,
            },
        })
            .then(res => res.json())
            .then(data => {
                data.isLoggedIn ? navigate(`/profile/${data.id}`) : null;
            });
    }, []);

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
                    <div className={`text-${msg ? "red" : "green"}-400 text-left text-sm`}>
                        {msg}
                    </div>
                    <button type="submit" className="auth-btn my-3">
                        Sign up
                    </button>
                </form>
                <Link to="/login" className="text-base m-0 text-emerald font-medium hover:underline hover:text-blue-800">
                    Already have an account? Sign in here.
                </Link>
            </div>
        </div>
    );
};

export default SignUp;