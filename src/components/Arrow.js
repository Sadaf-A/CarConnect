import React from 'react';
import { motion } from 'framer-motion';

const AnimatedArrow = () => {
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
      x: 350,  
      y: 150, 
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      x: 350, 
      y: 150, 
      transition: {
        duration: 4,
        ease: "easeInOut"
      },
    }
  };

  return (
    <svg width="500" height="500" viewBox="0 0 500 500" className="absolute w-full h-full">
      <motion.path
       d="M10,100 C35,60 70,60 100,100 C130,140 160,140 180,100 L270,-120"
        fill="transparent"
        stroke="#EA2831"
        strokeWidth="2"
                strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="5, 5"
        variants={pathVariants}
        initial="hidden"
        animate="visible"
      />
    </svg>
  );
};

export default AnimatedArrow;
