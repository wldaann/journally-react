import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Dashboard from "./pages/Dashboard";
import JournalEditor from "./pages/JournalEditor";
import Statistics from "./pages/Statistics";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Dashboard */}
        <Route
          path="/"
          element={<Dashboard />}
        />

        {/* Tambah Journal */}
        <Route
          path="/editor"
          element={<JournalEditor />}
        />

        {/* Edit Journal */}
        <Route
          path="/editor/:id"
          element={<JournalEditor />}
        />

        {/* Statistics */}
        <Route
          path="/statistics"
          element={<Statistics />}
        />

        {/* History */}
        <Route
          path="/history"
          element={<History />}
        />

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

    </BrowserRouter>
  );
}

export default App;