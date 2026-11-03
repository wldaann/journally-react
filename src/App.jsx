import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Dashboard from "./pages/Dashboard";
import JournalEditor from "./pages/JournalEditor";
import Statistics from "./pages/Statistics";
import History from "./pages/History";
import Habits from "./pages/Habits";
import Todo from "./pages/Todo";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
        {/* Dashboard */}
        <Route
  path="/"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
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

        {/* Habits */}
        <Route
          path="/habits"
          element={<Habits />}
        />

        {/* Todo */}
        <Route
          path="/todos"
          element={<Todo />}
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