import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UploadNotesStep from '@/components/notes/CreateWorksheetForm/UploadNotesPage/UploadNotesStep';

describe('UploadNotesStep', () => {
  const nextMock = jest.fn();
  const startLoadingMock = jest.fn();
  const stopLoadingMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component', () => {
    render(<UploadNotesStep next={nextMock} startLoading={startLoadingMock} stopLoading={stopLoadingMock} />);
    expect(screen.getByText(/Upload Document/)).toBeInTheDocument();
  });

  it('switches to YouTube Link tab', () => {
    render(<UploadNotesStep next={nextMock} startLoading={startLoadingMock} stopLoading={stopLoadingMock} />);
    fireEvent.click(screen.getByRole('button', { name: /Paste YouTube Link/i }));
    expect(screen.getByRole('heading', { name: /Paste YouTube Link/i })).toBeInTheDocument();
  });

  it('switches to Paste Text tab', () => {
    render(<UploadNotesStep next={nextMock} startLoading={startLoadingMock} stopLoading={stopLoadingMock} />);
    fireEvent.click(screen.getByRole('button', { name: /Paste Text/i }));
    expect(screen.getByRole('heading', { name: /Paste Text/i })).toBeInTheDocument();
  });
});
