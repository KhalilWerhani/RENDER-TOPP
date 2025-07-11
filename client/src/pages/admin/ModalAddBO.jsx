import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiUser, FiMail, FiPhone, FiKey,
  FiCreditCard, FiMapPin, FiGlobe, FiHash
} from "react-icons/fi";

const ModalAddBO = ({ onClose, onAddSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    cni: "",
    passportNumber: "",
    state: "",
    postCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Le nom est requis.";
    if (!form.email.trim()) return "L'email est requis.";
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))
      return "Email invalide.";
    if (!form.phone.trim()) return "Le téléphone est requis.";
    if (!/^\d{10}$/.test(form.phone))
      return "Le téléphone doit contenir 10 chiffres.";
    if (!form.password.trim()) return "Le mot de passe est requis.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/admin/create-bo", form, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Collaborateur BO ajouté avec succès !");
        onAddSuccess();
        onClose();
      } else {
        setError(res.data.message || "Erreur lors de l’ajout.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Erreur inconnue lors de la création.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Nom", icon: <FiUser /> },
    { name: "email", label: "Email", icon: <FiMail /> },
    { name: "phone", label: "Téléphone", icon: <FiPhone /> },
    { name: "password", label: "Mot de passe", icon: <FiKey /> },
    { name: "cni", label: "CNI", icon: <FiCreditCard /> },
    { name: "passportNumber", label: "N° Passeport", icon: <FiGlobe /> },
    { name: "state", label: "Ville / État", icon: <FiMapPin /> },
    { name: "postCode", label: "Code postal", icon: <FiHash /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl relative animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">➕ Ajouter un collaborateur BO</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(({ name, label, icon }) => (
            <div key={name} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">{label}</label>
              <div className="flex items-center border rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                <span className="pl-3 text-gray-400">{icon}</span>
                <input
                  type={name === "password" ? "password" : "text"}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={label}
                  className="w-full px-3 py-2 outline-none text-sm rounded-r-md"
                />
              </div>
            </div>
          ))}
        </form>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm bg-gray-200 hover:bg-gray-300 transition"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-md text-sm bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            {loading ? "Ajout..." : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddBO;
