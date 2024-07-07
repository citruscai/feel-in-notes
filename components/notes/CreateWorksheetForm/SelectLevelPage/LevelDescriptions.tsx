import React from 'react';
import { motion } from 'framer-motion';

type LevelDescriptionProps = {
  level: string;
};

const LevelDescriptions: React.FC<LevelDescriptionProps> = ({ level }) => {
  return (
    <motion.div
      key={level}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-background rounded-lg p-4 flex justify-center items-center"
      style={{ width: 600, height: 400 }} 
    >
      {level === "blanks" && (
        <img src="/fillintheblankexample.gif" alt="Fill in the blank notes" style={{ width: 600, height: 400 }} />
      )}
      {level === "questions" && (
        <img src="/questionbasedexample.gif" alt="Question based notes" style={{ width: 600, height: 400 }} />
      )}
    </motion.div>
  );
};

export default LevelDescriptions;
