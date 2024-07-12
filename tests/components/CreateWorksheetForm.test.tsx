import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateWorksheetForm from '@/components/notes/CreateWorksheetForm/CreateWorkSheetForm';
import { useCreateWorksheetContext } from '@/context/CreateWorksheetConext';


jest.mock('@/context/CreateWorksheetConext', () => ({
  useCreateWorksheetContext: jest.fn(),
}));


jest.mock('@/components/notes/CreateWorksheetForm/UploadNotesPage/UploadNotesStep', () => (props: any) => (
  <div>
    <span>Upload Notes Step</span>
    <button onClick={props.next}>Next</button>
  </div>
));

jest.mock('@/components/notes/CreateWorksheetForm/SelectLevelPage/SelectLevelStep', () => (props: any) => (
  <div>
    <span>Select Level Step</span>
    <button onClick={props.prev}>Previous</button>
  </div>
));

describe('CreateWorksheetForm', () => {
  const formStateMock = { notes: { text: '' } };

  beforeEach(() => {
    (useCreateWorksheetContext as jest.Mock).mockReturnValue({
      formState: formStateMock,
    });
  });

  it('renders the initial step', () => {
    render(<CreateWorksheetForm />);
    expect(screen.getByText('Upload Notes Step')).toBeInTheDocument();
  });

  it('navigates to the next step', () => {
    render(<CreateWorksheetForm />);
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Select Level Step')).toBeInTheDocument();
  });

  it('navigates back to the previous step', () => {
    render(<CreateWorksheetForm />);
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Previous'));
    expect(screen.getByText('Upload Notes Step')).toBeInTheDocument();
  });
});
