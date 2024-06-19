import { motion } from 'framer-motion';

type LevelDescriptionProps = {
  level: string;
};

const levelDescriptions: { [key: string]: string } = {
  moderate: "Moderate Support: Ideal for quick guidance and minor assistance.",
  high: "High Support: Suitable for detailed guidance and thorough support.",
  questions: "Questions: Best for interactive sessions with questions and answers.",
};

const LevelDescriptions: React.FC<LevelDescriptionProps> = ({ level }) => {
  return (
    <motion.div
      key={level}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 border border-primary rounded-lg"
    >
      <p className="text-primary">{levelDescriptions[level]}</p>
    </motion.div>
  );
};

export default LevelDescriptions;
