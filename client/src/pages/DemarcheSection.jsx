import { FaTrash } from "react-icons/fa";

const demarches = [
  {
    id: 1,
    nom: "Création de la micro-entreprise",
    date: "15 avril 2025",
    etat: "En cours",
  },
  {
    id: 2,
    nom: "Immatriculation au RCS",
    date: "20 avril 2025",
    etat: "Complétée",
  },
];

const DemarchesSection = () => {
  const handleDelete = (id) => {
    // TODO: Call API or remove locally
    console.log("Supprimer démarche avec ID:", id);
  };

  const handleReprendre = (id) => {
    // TODO: Redirect to resume
    console.log("Reprendre démarche:", id);
  };

  return (
    <div className=" backdrop-blur-md p-6 max-w-8xl mx-auto mt-10">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Vos démarches</h3>
      <div className="space-y-4">
        {demarches.map((d) => (
          <div
            key={d.id}
            className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div>
              <p className="text-lg font-medium">{d.nom}</p>
              <p className="text-sm text-gray-500">Date : {d.date}</p>
              <p className="text-sm text-gray-600">État : <span className="font-semibold">{d.etat}</span></p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleDelete(d.id)}
                className="text-red-500 hover:text-red-700 transition"
                title="Supprimer"
              >
                <FaTrash />
              </button>
              <button
                onClick={() => handleReprendre(d.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                Reprendre démarche
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemarchesSection;
