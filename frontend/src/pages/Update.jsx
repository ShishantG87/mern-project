import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Update({ setUser }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if(!token) {
            alert("You are not logged in.");
            return;
        }
        try {
            const res = await axios.put("/api/users", {email, username, password}, {headers: {Authorization: `Bearer ${token}`, }, });
            setUser(res.data);
            alert("Account updated!");
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Failed to update.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <form onSubmit={handleUpdate} className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <h2 className="text-2xl font-bold mb-4">Update Account</h2>
                <input type="email" className="w-full mb-4 p-3 border rounded" placeholder="New email" value={email}
                 onChange={(e) => setEmail(e.target.value)}/>
                <input type="text" className="w-full mb-4 p-3 border rounded" placeholder="New username" value={username}
                 onChange={(e) => setUsername(e.target.value)}/>
                 <input type="password" className="w-full mb-4 p-3 border rounded" placeholder="New password" value={password}
                 onChange={(e) => setPassword(e.target.value)}/>
                 <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
                    Update Account
                </button>
            </form>
        </div>
    );
}

export default Update;