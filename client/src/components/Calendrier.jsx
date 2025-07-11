import React, { useState } from 'react';

const availableTimes = [
  '09:00', '09:30', '10:00', '10:30', '11:00',
  '11:30', '12:00', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30',
];

const durations = [15, 30, 45, 60];

function Calendrier() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState(30);

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setSelectedTime(null); // reset on new selection
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-blue-800 text-center mb-6">
          📅 Calendrier de Disponibilité
        </h1>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-4 text-center mb-6">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => (
            <div key={i} className="font-semibold text-blue-700">
              {day}
            </div>
          ))}
          {Array.from({ length: 30 }).map((_, i) => {
            const day = i + 1;
            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                className={`h-20 flex items-center justify-center border rounded-lg cursor-pointer hover:bg-blue-100 transition ${
                  selectedDay === day ? 'bg-blue-200 text-white font-bold' : 'border-blue-200'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* If day selected */}
        {selectedDay && (
          <>
            <div className="text-center text-lg text-blue-800 font-semibold mb-2">
              Horaires disponibles pour le {selectedDay < 10 ? `0${selectedDay}` : selectedDay} avril :
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2 rounded-full border transition ${
                    selectedTime === time
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            <div className="text-center text-lg text-gray-800 font-medium mb-2">
              Choisir la durée du rendez-vous :
            </div>

            <div className="flex justify-center gap-4 mb-6">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-4 py-2 rounded-full border transition ${
                    duration === d
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100'
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>

            {selectedTime && (
              <div className="text-center text-green-700 font-semibold mt-4">
                Vous avez choisi le {selectedDay} avril à {selectedTime} pour {duration} minutes.
              </div>
            )}

            <div className="mt-6 text-center">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-200">
                Confirmer le rendez-vous
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Calendrier;
