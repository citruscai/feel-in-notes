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
      className="bg-muted rounded-lg p-4"
    >
      {level === "moderate" && (
        <>
          <h3 className="text-xl font-semibold mb-2">Moderate Support</h3>
          <p>Fill in the blank notes ideal for advanced students who need minor assistance.</p>
          <div className="grid gap-4 mt-4">
            <div>
              <p>Guided notes are ____________________________________</p>
            
            </div>
            <div>
              <p>They provide a ___________ framework that students can fill in during ___________.</p>
             
            </div>
            <div>
              <p>Guided notes can improve ___________ and ___________.</p>
             
            </div>
          </div>
        </>
      )}
      {level === "high" && (
        <>
          <h3 className="text-xl font-semibold mb-2">High Support</h3>
          <p>High Support: Suitable for students that need guidance and support.</p>
          <div className="grid gap-4 mt-4">
            <div>
              <p>Guided notes are <span className="font-bold">_____</span> tools designed to help students <span className="font-bold">____</span> and <span className="font-bold">_____</span> key concepts.</p>
             
            </div>
            <div>
              <p>They provide a <span className="font-bold">____</span> framework that students can fill in during <span className="font-bold">____</span>.</p>
            
            </div>
            <div>
              <p>Guided notes can improve <span className="font-bold">_____</span> and <span className="font-bold">_________</span>.</p>
              <input
                type="text"
                className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </>
      )}
      {level === "questions" && (
        <>
          <h3 className="text-xl font-semibold mb-2">Questions</h3>
          <p>Best for interactive sessions with questions and answers.</p>
          <div className="grid gap-4 mt-4">
            <div>
              <p>What are guided notes?</p>
              <p className="font-bold">Guided notes are structured tools designed to help students understand and retain key concepts.</p>
            </div>
            <div>
              <p>How do guided notes help in learning?</p>
              <p className="font-bold">They provide a clear framework that students can fill in during lessons, improving comprehension and engagement.</p>
            </div>
            <div>
              <p>What are the benefits of using guided notes?</p>
              <p className="font-bold">Guided notes can improve comprehension and engagement.</p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default LevelDescriptions;
