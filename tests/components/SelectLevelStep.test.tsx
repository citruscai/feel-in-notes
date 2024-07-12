import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectLevelStep from '@/components/notes/CreateWorksheetForm/SelectLevelPage/SelectLevelStep';
import { useCreateWorksheetContext } from '@/context/CreateWorksheetConext';

jest.mock('@/context/CreateWorksheetConext', () => ({
  useCreateWorksheetContext: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('SelectLevelStep', () => {
  const prevMock = jest.fn();
  const setFormStateMock = jest.fn();
  const formStateMock = { notes: { text: '', level: '' } };

  const startLoadingMock = jest.fn();
  const stopLoadingMock = jest.fn();

  beforeEach(() => {
    (useCreateWorksheetContext as jest.Mock).mockReturnValue({
      formState: formStateMock,
      setFormState: setFormStateMock,
    });
  });

  it('renders the component', () => {
    render(<SelectLevelStep prev={prevMock} startLoading={startLoadingMock} stopLoading={stopLoadingMock} />);
    expect(screen.getByText(/Select a level/)).toBeInTheDocument();
  });

  it('calls the prev function when the Back button is clicked', () => {
    render(<SelectLevelStep prev={prevMock} startLoading={startLoadingMock} stopLoading={stopLoadingMock} />);
    fireEvent.click(screen.getByRole('button', { name: /Back/i }));
    expect(prevMock).toHaveBeenCalled();
  });

  it('displays loading spinner when submitting', async () => {
    render(<SelectLevelStep prev={prevMock} startLoading={startLoadingMock} stopLoading={stopLoadingMock} />);
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    await waitFor(() => {
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });
});
