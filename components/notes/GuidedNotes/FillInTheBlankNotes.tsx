import React, { useContext, useRef, useEffect } from 'react';
import { NotesContext } from '@/context/NotesContext';
import { Button } from "@/components/ui/button";
import { Section } from '@/lib/types';

const FillInTheBlankNotes: React.FC = () => {
  const context = useContext(NotesContext);
  if (!context) throw new Error("NotesContext must be used within a NotesProvider");
  const { worksheet, userAnswers, setUserAnswers, loading, guidedNotesJSON } = context;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[index] = event.target.value;
    setUserAnswers(newUserAnswers);
  };

  const getTextWidth = (text: string, font = '16px Arial') => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const context = canvasRef.current.getContext('2d');
    if (!context) return 0;
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  };

  useEffect(() => {
    // Recalculate input widths on initial load
    console.log(guidedNotesJSON);
    const inputs = document.querySelectorAll('.dynamic-input');
    inputs.forEach((input, index) => {
      if (input instanceof HTMLInputElement) {
        const cleanPart = guidedNotesJSON?.sections?.flatMap((section: Section) =>
          section.content?.join(' ').split(/(<mark>.*?<\/mark>)/g)
        )
          ?.filter((part: string) => typeof part === 'string' && part.startsWith('<mark>') && part.endsWith('</mark>'))
          ?.map((part: string) => part.replace(/<\/?mark>/g, ''))[index];
  
        if (cleanPart) {
          const width = Math.min(getTextWidth(cleanPart) + 20, 300) + 'px'; 
          input.style.width = width;
        }
      }
    });
  }, [worksheet, guidedNotesJSON]);
  
  

  let answerIndex = 0;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!guidedNotesJSON || !guidedNotesJSON.sections) {
    return <div>Error loading worksheet.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {guidedNotesJSON.sections?.map((section: Section, sectionIndex: number) => (
        <div key={sectionIndex} className="mb-8">
          <h2 className="text-lg font-bold mb-4">{section.title}</h2>
          {section.content?.map((paragraph: string, paragraphIndex: number) => {
            const parts = paragraph.split(/(<mark>.*?<\/mark>)/g).map((part: string, index: number) => {
              if (part.startsWith('<mark>') && part.endsWith('</mark>')) {
                const cleanPart = part.replace(/<\/?mark>/g, '');
                const inputValue = userAnswers[answerIndex] || '';
                const inputWidth = Math.min(getTextWidth(cleanPart) + 20, 300) + 'px';
                const inputElement = (
                  <input
                    key={answerIndex}
                    className="inline-block mx-2 border border-black dynamic-input"
                    value={inputValue}
                    onChange={handleInputChange(answerIndex)}
                    style={{ width: inputWidth }}
                  />
                );
                answerIndex++;
                return (
                  <React.Fragment key={index}>
                    {inputElement}
                    <span className="ml-2">{cleanPart}</span>
                  </React.Fragment>
                );
              }
              return <span key={index}>{part}</span>;
            });
            return <p key={paragraphIndex}>{parts}</p>;
          })}
        </div>
      ))}
      <Button onClick={() => localStorage.setItem('userAnswers', JSON.stringify(userAnswers))} variant="default" className="mt-4">Save Progress</Button>
    </div>
  );
}  

export default FillInTheBlankNotes;
