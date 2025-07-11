import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ModalChangePasswordBO = ({ boId, onClose }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    try {
      await axios.put(`/api/admin/update-bo-password/${boId}`, { password }, {
        withCredentials: true,
      });
      toast.success("Mot de passe mis à jour.");
      onClose();
    } catch (err) {
      setError("Erreur lors de la mise à jour.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-lg font-bold mb-4 text-indigo-700">Changer le mot de passe</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded shadow-sm"
              required
            />
          </div>

          <div className="flex justify-end gap-4 mt-4">
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
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
            >
              {loading ? "Enregistrement..." : "Valider"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalChangePasswordBO;
