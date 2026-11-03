
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/authService";

function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  function handleLogout() {
    logoutUser();
    navigate("/login", { replace: true });
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-5">
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
        <div className="flex items-center gap-6">
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
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-lg"
          >
            + New Journal
          </button>

          {/* User */}
          <div className="flex items-center gap-3 border-l border-gray-200 pl-5">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">
                Hi, {user?.name || "User"} 👋
              </p>

              <p className="text-xs text-gray-500">
                Personal Life System
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
