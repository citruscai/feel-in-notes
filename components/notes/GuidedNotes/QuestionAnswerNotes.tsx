import React, { useContext } from 'react';
import { NotesContext } from '@/context/NotesContext';
import { Button } from "@/components/ui/button";
import { QuestionItem } from '@/lib/types';

const QuestionAnswerNotes: React.FC = () => {
  const context = useContext(NotesContext);
  if (!context) throw new Error("NotesContext must be used within a NotesProvider");
  const { guidedNotesJSON, userAnswers, loading, setUserAnswers } = context;

  const handleInputChange = (index: number) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[index] = event.target.value;
    setUserAnswers(newUserAnswers);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!guidedNotesJSON || !guidedNotesJSON.questions) {
    return <div>Error loading worksheet.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen p-8 bg-[#FFF8E1]">
      <header className="mb-8">
        <div className="text-center">
          <div className="text-xl font-semibold">{guidedNotesJSON.title}</div>
        </div>
      </header>
      {guidedNotesJSON.questions.map((questionItem: QuestionItem, questionIndex: number) => {
        const question = questionItem.question;
        const inputValue = userAnswers[questionIndex] || '';
        
        return (
          <div key={questionIndex} className="mb-8">
            <h3 className="text-lg font-bold mb-2">{question}</h3>
            <textarea
              value={inputValue}
              onChange={handleInputChange(questionIndex)}
              className="w-full p-2 border border-black"
              rows={3}
            />
          </div>
        );
      })}
      <Button onClick={() => localStorage.setItem('userAnswers', JSON.stringify(userAnswers))} variant="default" className="mt-4">Save Progress</Button>
    </div>
  );
};

export default QuestionAnswerNotes;
