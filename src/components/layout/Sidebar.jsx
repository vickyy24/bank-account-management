import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-white border-r transform transition-transform lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Bank Admin
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-gray-100 lg:hidden"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) =>
              `mb-2 block rounded-md px-4 py-2 text-sm font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/accounts"
            onClick={onClose}
            className={({ isActive }) =>
              `block rounded-md px-4 py-2 text-sm font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Accounts
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;