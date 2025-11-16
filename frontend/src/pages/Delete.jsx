import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DeleteAccount({ setUser }) {
     const navigate = useNavigate();
    const handleDelete = async () => {
       
        const sure = window.confirm("Are you sure you want to delete your account?");
        if (!sure) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You are not logged in.");
                return;
            }
            await axios.delete("/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            localStorage.removeItem("token");
            setUser(null);
            navigate("/");
        }
         catch (err) {
            console.error(err);
            alert("Something went wrong deleting your account");
         }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <h2 className="text-2xl font-bold mb-4">
                    Delete Your Account?
                </h2>
                <p className="text-gray-600 mb-6">
                    This action cannot be undone.
                </p>
                <button onClick={handleDelete} className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600">
                        Yes, delete my account
                </button>
            </div>
        </div>
    );
};


export default DeleteAccount;
