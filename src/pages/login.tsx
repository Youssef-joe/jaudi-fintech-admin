import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async(e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password
            });

            const {token, user} = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            navigate('/')

        } catch(err: any) {
            setError(err.reponse?.data?.message || "Login Faild")
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="space-y-4 p-6 border rounded shadow w-[300px]">
        <h2 className="text-xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
    )

};

export default Login