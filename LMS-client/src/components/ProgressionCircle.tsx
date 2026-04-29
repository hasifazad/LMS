const ProgressionBar = ({ totalSteps=6, currentStep=3 }) => {
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

  return (
    <div className="flex items-center justify-center space-x-4 md:space-x-6">
      {steps.map((step) => (
        <div key={step} className="flex items-center">
          {/* Circle for the step */}
          <div
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold 
              ${step < currentStep ? 'bg-green-500' : 
                step === currentStep ? 'bg-blue-500' : 'bg-gray-300'}
              transition-all duration-300`}
          >
            {step < currentStep ? (
              <span className="text-xl md:text-2xl">✔</span>
            ) : (
              <span className="text-sm md:text-base">{step}</span>
            )}
          </div>

          {/* Line connecting the circles */}
          {step < totalSteps && (
            <div className="w-12 md:w-16 h-1 bg-gray-300"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressionBar;
