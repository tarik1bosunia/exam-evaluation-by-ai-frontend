# Exam AI

Exam AI is a modern web application designed for creating, managing, and submitting exams, leveraging the power of AI to streamline the process.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn/UI](https://ui.shadcn.com/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Zod](https://zod.dev/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

- npm

  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/your_username/exam-ai.git
   ```

2. Install NPM packages

   ```sh
   npm install
   ```

### Running the Application

To run the app in the development mode, use:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits.

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in the development mode with Turbopack.
- `npm run build`: Builds the app for production to the `.next` folder.
- `npm run start`: Starts a Next.js production server.
- `npm run lint`: Runs the linter to check for code quality.

## Features

- **AI-Powered Grading:** Leverages AI to automatically grade exams, saving educators significant time and effort.
- **Multi-Step Exam Creation:** An intuitive, step-by-step process to create exams with detailed instructions and questions.
- **Dynamic Question Management:** Easily add, remove, and edit questions within the exam creation flow.
- **PDF Submissions:** Supports student answer sheet submissions via PDF upload with a user-friendly drag-and-drop interface.
- **Centralized Dashboard:** A dashboard to view and manage created exams.
- **Detailed Analytics:** Provides insights into student performance and class-wide analytics.

## Project Structure

The project is organized into several key directories:

- `app/`: Contains the main pages and routing for the Next.js application.
  - `app/page.tsx`: The main landing page and entry point for the application.
  - `app/submisson/page.tsx`: The page for handling student PDF submissions.
- `components/`: Houses the reusable React components.
  - `components/ExamCreation.tsx`: The main component for the multi-step exam creation process.
  - `components/ui/`: Contains the Shadcn/UI components.
- `lib/`: Includes utility functions and the Redux store setup.
  - `lib/redux/`: Contains the Redux Toolkit setup, including API slices for communicating with the backend.
- `guides/`: Contains markdown guides for developers.
  - `guides/ai/exam-creation-guide.md`: A detailed guide on the exam creation process.
  - `guides/initial/installation.md`: Initial installation notes.

## Guides

This project includes detailed guides to help with development and understanding the architecture.

- **[Exam Creation Guide](./guides/ai/exam-creation-guide.md):** A comprehensive walkthrough of the multi-step exam creation process, including both frontend and backend implementation details.
- **[Installation Guide](./guides/initial/installation.md):** Notes on the initial setup and installation of dependencies.

<details>
<summary>Package Installation History</summary>

```bash
npm install react-dropzone

npm install @radix-ui/react-toast @radix-ui/react-accordion @radix-ui/react-alert-dialog @reduxjs/toolkit react-redux @radix-ui/react-aspect-ratio @radix-ui/react-checkbox @radix-ui/react-avatar @radix-ui/react-dropdown-menu @radix-ui/react-context-menu @radix-ui/react-hover-card @radix-ui/react-menubar @radix-ui/react-select @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-toggle-group @radix-ui/react-tooltip

npm install embla-carousel-react
npm install react-day-picker
npm i recharts
npm install react-hook-form @hookform/resolvers zod
npm i react-toastify
```

</details>
