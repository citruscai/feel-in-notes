import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UploadNotesStep from '@/components/notes/CreateWorksheetForm/UploadNotesPage/UploadNotesStep';

describe('UploadNotesStep', () => {
  it('renders upload document button', () => {
    render(<UploadNotesStep next={() => {}} />);
    const uploadButton = screen.getByText('Upload Document');
    expect(uploadButton).toBeInTheDocument();
  });

  it('renders paste YouTube link button', () => {
    render(<UploadNotesStep next={() => {}} />);
    const youtubeButton = screen.getByText('Paste YouTube Link');
    expect(youtubeButton).toBeInTheDocument();
  });

  it('renders paste text button', () => {
    render(<UploadNotesStep next={() => {}} />);
    const pasteTextButton = screen.getByText('Paste Text');
    expect(pasteTextButton).toBeInTheDocument();
  });

  it('changes active tab on button click', () => {
    render(<UploadNotesStep next={() => {}} />);
    const youtubeButton = screen.getByText('Paste YouTube Link');
    fireEvent.click(youtubeButton);
    const youtubeLinkInput = screen.getByPlaceholderText('Enter YouTube link');
    expect(youtubeLinkInput).toBeInTheDocument();
  });
});
