// Lets create a login pages which calls my DRF api
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/jwt/register/', form);
            setMessage('Registration successful!');
            navigate('/login');

        } catch (error) {
            setMessage(error.response?.data?.detail || 'Registration failed.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="flex items-center justify-center flex-1 ">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md black">
                    <form onSubmit={handleSubmit} className="bg-black-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-white text-lg font-bold mb-4">Sign Up</h2>
                        {message && <div className="mb-4 text-yellow-400">{message}</div>}
                        <div className="mb-4">
                            <label className="block text-white mb-2" htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className="w-full p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white mb-2" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white mb-2" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white mb-2" htmlFor="password2">Confirm Password</label>
                            <input
                                type="password"
                                id="password2"
                                name="password2"
                                value={form.password2}
                                onChange={handleChange}
                                className="w-full p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white mb-2" htmlFor="first_name">First Name</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={form.first_name}
                                onChange={handleChange}
                                className="w-full p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white mb-2" htmlFor="last_name">Last Name</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={form.last_name}
                                onChange={handleChange}
                                className="w-full p-2 rounded"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-yellow-400 text-gray-800 px-4 py-2 rounded">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
