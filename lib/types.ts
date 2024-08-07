export type Notes ={
    text: string,
    id:string,
    level:string,

}


export type Worksheet ={
    date: string,
    id:string,
    text:string,
    level:string
    guided_notes_url:string,
   solutions_url:string,
}

export interface Params {
    params: {
      id: string;
    };
  }

  export interface QuestionItem {
    question: string;

  }
  export interface List {
    list_title: string;
    items: string[];
  }
  
  export interface Question {
    question: string;
    answer: string;
  }
  
  export interface Section {
    title: string;
    content: string[];
    lists?: List[];
  }
  
  export interface JsonData {
    title?: string;
    sections?: Section[];
    questions?: Question[];
  }
  