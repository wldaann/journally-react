# Journally

> A simple and modern daily journal & reflection web application built with React and Tailwind CSS.

Journally is a personal journaling application designed to help users write, organize, and reflect on their daily experiences in a clean and comfortable interface.
# Features

- 📝 Create, edit, and delete daily journals
- 😊 Mood selection for each journal
- 🏷️ Journal tagging and filtering
- 🔍 Search journals by title
- ↕️ Sort journals by newest, oldest, A–Z, and Z–A
- ❤️ Favorite journals
- 📸 Upload, preview, replace, and delete journal images
- 📄 Export journals to PDF
- 📊 Daily journal summary
- 💾 Local data persistence using browser Local Storage
- 📱 Responsive design for desktop and mobile devices
- ✍️ Support for journal content up to 10,000 characters

# Tech Stack

- React
- JavaScript
- Tailwind CSS
- Vite
- React Router
- Local Storage
- jsPDF

# 🌐 Live Demo

Try Journally here:

[Open Journally](https://journally-react-7wwn.vercel.app/)

# Repository

[View source code on GitHub](https://github.com/wldaann/journally-react)

# Screenshots
 Dashboard, Editor, History.

![Journally Dashboard](./public/screenshots/dashboard.png)
![Journally Dashboard](./public/screenshots/dashboard2.png)
![Journally Dashboard](./public/screenshots/Editor.png)
![Journally Dashboard](./public/screenshots/Editor2.png)
![Journally Dashboard](./public/screenshots/History.png)
![Journally Dashboard](./public/screenshots/History2.png)

#  Getting Started

### Prerequisites

Before running the project, make sure you have installed:

- Node.js
- npm
- Git

 1. Clone the Repository
git clone https://github.com/wldaann/journally-react.git

2. Navigate to the project
cd journally-react

3. Install Dependencies
npm install

4. Start the Development Server
npm run dev

5. Open the Application

Open the local development URL shown in the terminal, usually:
http://localhost:5173

6. Build for Production

To create a production build:
npm run build

## 📁 Project Structure

BELAJAR-REACT
daily-journal/
│
├── public/
│   └── screenshots/
│       ├── dashboard.png
│       ├── editor.png
│       └── history.png
│
├── src/
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── JournalCard.jsx
│   │   ├── MoodCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SortJournal.jsx
│   │   ├── TagFilter.jsx
│   │   └── MoodFilter.jsx
│   │  
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── History.jsx
│   │   └── JournalEditor.jsx
│   │
│   ├── services/
│   │   └── journalService.js
│   │
│   ├── utils/
│   │   ├── exportPDF.js
│   │   └── exportAllPDF.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md

## How It Works

Journally follows a simple client-side data flow:

1. The user creates or edits a journal entry.
2. Journal data is managed using React state.
3. Images are processed and compressed on the client side before being stored.
4. Journal data is saved to the browser's Local Storage.
5. Dashboard and History retrieve journal data from Local Storage.
6. Users can search, filter, sort, favorite, edit, or delete journal entries.
7. Journal entries can also be exported as PDF documents.

## Data Storage

Journally currently uses the browser's Local Storage to persist journal data.
This approach allows the application to work without a backend server or external database.
Because the data is stored locally in the browser, journal entries are specific to the browser and device where they were created.

## Author

**Wldaann**

GitHub: [@wldaann](https://github.com/wldaann)
