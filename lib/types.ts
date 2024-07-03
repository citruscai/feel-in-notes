export type Notes ={
    text: string,
    id:string,
    level:string,

}
export interface Section {
    title: string;
    content: string[];
  }

export type Worksheet ={
    date: string,
    id:string,
    text:string,
    level:string
}

export interface Params {
    params: {
      id: string;
    };
  }
