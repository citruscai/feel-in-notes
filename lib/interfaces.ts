export interface Notes {
    text: string;
    id: string;
    level: string;
  }
  
  export interface Worksheet {
    date: string;
    id: string;
    text: string;
    level: string;
  }
  
  export interface FormState {
    notes: Notes;
    worksheet: Worksheet;
  }