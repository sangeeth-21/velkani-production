import React from 'react';
import Lottie from 'lottie-react';
import serviceUnavailableAnimation from '../assets/gZ7IY67cWU.json'; // Adjust the path to your JSON file

const ServiceUnavailable = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-lg"> {/* Adjust max-width as needed */}
        <Lottie 
          animationData={serviceUnavailableAnimation}
          loop={true}
          autoplay={true}
          style={{
            width: '100%',
            height: '100%',
          }}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid meet'
          }}
        />
      </div>
    </div>
  );
};

export default ServiceUnavailable;