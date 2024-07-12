import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateWorksheetForm from '@/components/notes/CreateWorksheetForm/CreateWorkSheetForm';
import { useCreateWorksheetContext } from '@/context/CreateWorksheetConext';

jest.mock('@/context/CreateWorksheetConext', () => ({
  useCreateWorksheetContext: jest.fn(),
}));


jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe('CreateWorksheetForm', () => {
  const formStateMock = { notes: { text: '', level: '' } };
  const setFormStateMock = jest.fn();

  beforeEach(() => {
    (useCreateWorksheetContext as jest.Mock).mockReturnValue({
      formState: formStateMock,
      setFormState: setFormStateMock,
    });
  });

  it('renders the UploadNotesStep component initially', () => {
    render(<CreateWorksheetForm />);
    expect(screen.getByText(/Upload Document/)).toBeInTheDocument();
  });

  it('renders the SelectLevelStep component after completing UploadNotesStep', async () => {
    render(<CreateWorksheetForm />);

    
    const uploadDocumentButton = screen.getByRole('button', { name: /Upload Document/i });
    fireEvent.click(uploadDocumentButton);

    
    const fileInput = screen.getByLabelText('Click to upload', { exact: false });
    if (fileInput) {
      fireEvent.change(fileInput, {
        target: { files: [new File(['file contents'], 'test.pdf', { type: 'application/pdf' })] },
      });
    }

    
    setFormStateMock.mockImplementationOnce((callback) => {
      callback({ notes: { text: 'sample text', level: '' } });
    });

    await waitFor(() => {
      expect(screen.getByText(/Select a level/)).toBeInTheDocument();
    });
  });
});
