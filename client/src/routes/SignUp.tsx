import { Link } from 'react-router-dom';
import React, { useState } from 'react';

const SignUp: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Login submitted:', { email, password });
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="bg-white p-12 w-full max-w-[400px] shadow-auth-card rounded-xl">
                <h2 className="text-2xl text-emerald-950 font-semibold m-0 mb-5">Create an Account</h2>
                <form onSubmit={handleSubmit} className="">
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