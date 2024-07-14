import './globals.css';
import { Inter } from 'next/font/google';
import { CreateWorksheetProvider } from '@/context/CreateWorksheetConext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Feel In Notes',
  description: 'Create your guided notes!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CreateWorksheetProvider>
          {children}
        </CreateWorksheetProvider>
      </body>
    </html>
  );
}

