<p align="center">
  <a>
    <img src="https://i.ibb.co/Y2LckdC/1.png" height="200">
    <h3 align="center">:pencil2: Feel In Notes :page_with_curl: </h3>
  </a>
</p>

<p align="center">Creating guided notes with Natural Language Processing and Artificial Intelligence </p>

<br/>

## Introduction

Feel-In-Notes is a web application designed to assist both educators and learners in easily creating guided notes worksheets to understand a resource. This application can generate fill-in-the-blank notes or worksheets with questions from resources such as PowerPoint slides, articles, YouTube links, or given text.

As a student with ADHD, taking notes for my classes could be a very stressful process. During grade school, I had teachers hand out fill-in-the-blank notes, and they were instrumental in keeping me engaged in the lesson and retaining important information, which helped me score high on tests. Once I entered college, I was left on my own and struggled with taking notes. Despite trying every tip possible, I still found it challenging. I remembered how much guided notes helped me in the past and tried to find a way to create them for my college classes, but was saddened to see that there wasn't a non-tedious option available. Even educators were complaining about how tedious creating guided notes were despite their immense help in the classroom.

I created this web application to finally solve this problem!
## Features
![Screenshot 2024-07-19 112939](https://github.com/user-attachments/assets/8c30a4f1-c078-4702-96a6-156b8cbddba2)

- **Guided Notes Creation**: Generate fill-in-the-blank notes and question-based notes in PDF format from various resources such as PowerPoint slides, articles, YouTube links, and given text.
- **Interactive Notes**: Use an interactive version of the notes directly within the application, allowing students to fill in blanks and answer questions in real-time.
- **Progress Saving**: Save your progress on interactive notes, making it easy to pick up where you left off at any time.
- **Multiple Input Formats**: Support for uploading documents, pasting YouTube links, and inputting text directly to generate notes.
- **Accessible**: Designed to be user-friendly for students with ADHD and other learning disabilities.

## Technologies Used 
 ### Frontend 
  - Next.js
  -  React
  - TailwindCSS 
  - Shadcn UI

 ### Backend
 - Flask
 - MongoDB Atlas
 - Amazon S3
 - Google Gemini

### Other Tools
 - office-text-extractor
 - youtube-transcript
 - react-pdf
 - keyBERT
### Testing
- pytest
- Jest

## Demo 
Coming soon!




## Getting Started


1. First, clone the project:
2. install dependencies

```bash
npm install
# or
yarn
# or
pnpm install
```

3. run the development servers, the flask side is set up to run concurrently and will install any dependencies needed for the flask side when you run this command:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The Flask server will be running on [http://127.0.0.1:5328](http://127.0.0.1:5328) – feel free to change the port in `package.json` (you'll also need to update it in `next.config.js`).'

## Contact 
Contact me at cairo@feelinnotes.com for any questions or help and feel free to add to the issues tab if you spot any! 
