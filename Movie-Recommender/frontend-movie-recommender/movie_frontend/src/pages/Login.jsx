// Lets create a login pages which calls my DRF api
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';


export default function Login() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { user, setUser } = useUser();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://moviesense-backend:8000/api/auth/jwt/login/', form, { withCredentials: true });
            setMessage('Login successful!');
            console.log('Login response:', response.data);
            await setUser({
                id: response.data.user.id,
                name: response.data.user.username,
                email: response.data.user.email,
            });
            navigate('/');
        } catch (error) {
            setMessage(error.response?.data?.detail);
            console.error('Login error:', error);
        }
    };


    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="flex items-center justify-center flex-1 ">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md black">
                    <form onSubmit={handleSubmit} className="bg-black-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-white text-lg font-bold mb-4">Login</h2>
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
                        <button type="submit" className="bg-yellow-400 text-gray-800 px-4 py-2 rounded" onClick={handleSubmit}>Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
