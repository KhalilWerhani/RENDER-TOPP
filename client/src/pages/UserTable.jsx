import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const UserTable = () => {
  const { backendUrl } = useContext(AppContent);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(backendUrl + "/api/user/all", {
          withCredentials: true,
        });
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      // Pass userId as URL parameter
      const res = await axios.delete(`${backendUrl}/api/user/delete/${userId}`, {
        withCredentials: true,
      });
  
      if (res.data.success) {
        setUsers(users.filter((u) => u._id !== userId));
        toast.success("User deleted successfully");
      } else {
        toast.error("Failed to delete user");
      }
    } catch (err) {
      toast.error("Error deleting user");
      console.error(err);
    }
  };
  

  const handleEdit = (userId) => {
    // You can redirect or open modal here
    toast.info(`Edit user ID: ${userId}`);
  };

  return (
    <div className="py-2">
      <h2 className="text-xl font-bold text-blue-600  mb-3">Utilisateurs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg ">
          <thead className="bg-blue-100">
            <tr>
            <td className="py-2 font-semibold  px-5">N°</td>
              <td className="p-3 font-semibold">Nom</td>
              <td className="p-3 font-semibold">Email</td>
              <td className="p-3 font-semibold">Téléphone</td>
              <td className="p-3 font-semibold">CNI</td>
              <td className="p-3 font-semibold">Passeport</td>
              <td className="p-3 font-semibold">État</td>
              <td className="p-3 font-semibold">Code postal</td>
              <td className="p-3 font-semibold">Code postal</td>
              <td className="p-3 font-semibold">Actions</td>
            </tr>
          </thead>
          <tbody>
            {users.map((u,counter) => (
              <tr key={u._id} className="hover:bg-blue-100 cursor-pointer ">
                <td className="py-2 border-b px-5">{counter}</td>
                <td className="p-3 border-b">{u.name || "-"}</td>
                <td className="p-3 border-b">{u.email || "-"}</td>
                <td className="p-3 border-b">{u.phone || "-"}</td>
                <td className="p-3 border-b">{u.cni || "-"}</td>
                <td className="p-3 border-b">{u.passportNumber || "-"}</td>
                <td className="p-3 border-b">{u.state || "-"}</td>
                <td className="p-3 border-b">{u.postCode || "-"}</td>
                <td className="p-3 border-b">{u.role || "-"}</td>
                <td className="p-4 flex space-x-3 border-b ">
                  <button
                    onClick={() => handleEdit(u._id)}
                    className="text-blue-600 hover:text-blue-800 " 
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-4">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
