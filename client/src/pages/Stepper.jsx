import React from 'react';
import { CheckCircle, Lock, CreditCard, FileText, ClipboardCheck } from 'lucide-react';
import './Stepper.css'

const steps = [
  { 
    id: 1, 
    name: 'Formulaire', 
    icon: <FileText size={18} />,
    description: 'Remplissez le formulaire'
  },
  { 
    id: 2, 
    name: 'Paiement', 
    icon: <CreditCard size={18} />,
    description: 'Effectuez le paiement'
  },
  { 
    id: 3, 
    name: 'Dossier', 
    icon: <ClipboardCheck size={18} />,
    description: 'Déposez vos documents'
  },
  { 
    id: 4, 
    name: 'Validation', 
    icon: <CheckCircle size={18} />,
    description: 'En traitement'
  },
];

const Stepper = ({ currentStep = 1 }) => {
  return (
    <div className="w-full px-4 py-8 bg-white rounded-lg shadow-sm">
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-in-out" 
            style={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
            }}
          ></div>
        </div>

        <div className="flex justify-between relative z-10">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            const isUpcoming = currentStep < step.id;

            return (
              <div 
                key={step.id} 
                className="flex flex-col items-center w-1/4"
              >
                {/* Step circle */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  border-2 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-[#f4d47c] border-[#f4d47c] text-[#f4d47c]' 
                    : isActive 
                      ? 'bg-blue-100 border-blue-600 text-blue-700'
                      : isUpcoming
                        ? 'bg-gray-100 border-gray-300 text-gray-400'
                        : ''
                  }
                  shadow-sm
                `}>
                  {isCompleted ? (
                    <CheckCircle size={20} className="text-white" />
                  ) : (
                    <div className="flex items-center justify-center">
                      {React.cloneElement(step.icon, {
                        className: isActive ? 'text-blue-600' : 'text-gray-400'
                      })}
                    </div>
                  )}
                </div>

                {/* Step text */}
                <div className="mt-3 text-center">
                  <p className={`
                    text-sm font-medium
                    ${isCompleted 
                      ? 'text-[#f4d47c]' 
                      : isActive 
                        ? 'text-blue-700 font-semibold'
                        : 'text-gray-500'
                    }
                  `}>
                    {step.name}
                  </p>
                  <p className={`
                    text-xs mt-1
                    ${isCompleted 
                      ? 'text-[#f4d47c]' 
                      : isActive 
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }
                  `}>
                    {step.description}
                  </p>
                </div>

                {/* Lock icon for upcoming steps */}
                {isUpcoming && (
                  <div className="mt-2 text-gray-400">
                    <Lock size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stepper;