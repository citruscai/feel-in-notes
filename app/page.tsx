import Image from 'next/image';
import CreateWorksheetForm from '@/components/notes/CreateWorksheetForm/CreateWorkSheetForm';
import './globals.css';

export default function Home() {
  return (
    <div className="theme-custom min-h-screen flex flex-col bg-background">
      <header className="bg-primary text-primary-foreground p-4">
        <h1 className="text-xl font-bold">Home</h1>
      </header>
      <div className="flex-grow w-full flex flex-col sm:flex-row py-4">
        <aside className="w-full sm:w-1/4 flex-shrink-0 px-4">
          <div className="sticky top-0 p-4 w-full h-full">
            
          </div>
        </aside>
        <main role="main" className="w-full sm:w-2/4 flex-grow pt-1 px-3">
          <CreateWorksheetForm />
        </main>
        <aside className="w-full sm:w-1/4 flex-shrink-0 px-2">
          <div className="flex sm:flex-col px-2">
         
          </div>
        </aside>
      </div>
      <footer className="bg-secondary text-secondary-foreground p-4 mt-auto">
        Footer content
      </footer>
    </div>
  );
}
