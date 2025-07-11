import React, { useState } from 'react';

const AppointmentScheduler = ({ open, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [step, setStep] = useState(1); // 1: select date, 2: select time, 3: enter details
  const [appointmentDetails, setAppointmentDetails] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    subject: '',
    notes: ''
  });

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    
    return dates;
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '12:00', '12:30',
    '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  const formatTimeDisplay = (time) => {
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours, 10);
    return hourNum < 12 ? `${time} AM` : `${hourNum === 12 ? 12 : hourNum - 12}:${minutes} PM`;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setStep(2);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/appointments`, {
        date: selectedDate,
        time: selectedTime,
        expertId: expert?._id,
        userId: userData?.id,
        ...appointmentDetails
      }, { withCredentials: true });
      
      toast.success("Rendez-vous confirmé avec succès!");
      onClose();
      setSelectedDate(null);
      setSelectedTime('');
      setAppointmentDetails({
        name: userData?.name || '',
        email: userData?.email || '',
        subject: '',
        notes: ''
      });
      setStep(1);
    } catch (err) {
      toast.error("Erreur lors de la réservation du rendez-vous");
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred background overlay */}
      <div 
        className="fixed inset-0 bg-opacity-30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal container */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              {step === 1 && 'Choisir une date'}
              {step === 2 && 'Choisir un horaire'}
              {step === 3 && 'Confirmer votre rendez-vous'}
            </h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-indigo-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress steps */}
          <div className="mt-6">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= stepNumber ? 'bg-white text-indigo-600' : 'bg-white bg-opacity-20 text-white'} transition-colors`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`h-1 w-8 ${step > stepNumber ? 'bg-white' : 'bg-white bg-opacity-20'} transition-colors`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Disponibilités de {expert?.name || 'notre expert'}</h3>
              <div className="grid grid-cols-3 gap-3">
                {generateDates().map((date, index) => {
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <button
                      key={index}
                      onClick={() => handleDateSelect(date)}
                      className={`p-3 rounded-lg border transition-all flex flex-col items-center ${
                        selectedDate?.toDateString() === date.toDateString() 
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                      }`}
                    >
                      <span className={`text-xs ${isToday ? 'font-bold text-indigo-600' : 'text-gray-500'}`}>
                        {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                      </span>
                      <span className={`text-lg font-medium ${isToday ? 'text-indigo-600' : 'text-gray-800'}`}>
                        {date.getDate()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {date.toLocaleDateString('fr-FR', { month: 'short' })}
                      </span>
                      {isToday && (
                        <span className="mt-1 text-xs px-1 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                          Aujourd'hui
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">
                Disponibilités le {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((time, index) => (
                  <button
                    key={index}
                    onClick={() => handleTimeSelect(time)}
                    className={`py-2 px-3 rounded-lg border transition-all ${
                      selectedTime === time 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    {formatTimeDisplay(time)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700">Rendez-vous programmé avec</p>
                <p className="font-medium text-indigo-900">{expert?.name || 'Support Team'}</p>
                <p className="text-sm mt-2 text-indigo-700">
                  {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  {' à '}
                  {formatTimeDisplay(selectedTime)}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={appointmentDetails.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={appointmentDetails.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Sujet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={appointmentDetails.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Objet de la consultation"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes supplémentaires
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={appointmentDetails.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Décrivez brièvement votre demande..."
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                  Confirmer le rendez-vous
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentScheduler;