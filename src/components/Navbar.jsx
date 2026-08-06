import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">

      <div className="max-w-6xl mx-auto flex items-center justify-between px-8 py-5">

        {/* Logo */}

        <div
          onClick={() => navigate("/")}
          className="cursor-pointer"
        >

          <h1 className="text-3xl font-bold text-slate-900 transition hover:text-blue-600">
            📖 Journally
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Write • Reflect • Grow
          </p>

        </div>

        {/* Menu */}

        <div className="flex items-center gap-10">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-medium transition ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `font-medium transition ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`
            }
          >
            History
          </NavLink>

          <NavLink
            to="/statistics"
            className={({ isActive }) =>
              `font-medium transition ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`
            }
          >
            Statistics
          </NavLink>

          <button
            onClick={() => navigate("/editor")}
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-lg"
          >
            + New Journal
          </button>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;