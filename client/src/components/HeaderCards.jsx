// src/components/HeaderCards.jsx
import { assets } from "../assets/assets";



const HeaderCards = () => {
    const cards = [
      { title: "Total Clients", value: "1000", percent: "81%", color: "text-blue-500" },
      { title: "Total Entreprise Or Project ", value: "14,160", percent: "62%", color: "text-red-500" },
      { title: "Total Documents", value: "10,864", percent: "44%", color: "text-green-500" }
    ];
  
    return (
      <div className=" grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md">
           <h4 className="text-sm font-medium text-indigo-300 mb-2 flex items-center gap-2">
            {card.title} <img src={assets.user_connecion} alt="" className="w-20 h-20 object-contain" />
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-2xl text-gray-500  font-bold">{card.value}</span>
              <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center">
                <span className={`text-sm font-bold ${card.color}`}>{card.percent}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default HeaderCards;
  