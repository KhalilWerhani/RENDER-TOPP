import { useState } from "react";
import axios from "axios";

const ModalEditBO = ({ bo, onClose, onUpdate }) => {
  const [form, setForm] = useState({ ...bo });
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
      return "Le numéro de téléphone doit contenir 10 chiffres.";
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
      const res = await axios.put(`/api/admin/update-bo/${bo._id}`, form, {
        withCredentials: true,
      });
      onUpdate(res.data.data);
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.message || "Erreur inconnue lors de la mise à jour.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative">
        <h2 className="text-lg font-bold mb-4 text-blue-700">Modifier Collaborateur</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "email", "phone", "cni", "passportNumber", "state", "postCode"].map((field) => (
            <div key={field}>
              <label className="text-sm font-medium block mb-1 capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={form[field] || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded shadow-sm"
              />
            </div>
          ))}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditBO;
