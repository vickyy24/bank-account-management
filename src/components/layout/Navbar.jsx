import { Menu } from "lucide-react";

function Navbar({ onMenuClick }) {
  return (
    <header className="flex h-16 items-center border-b bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="mr-3 rounded-md p-2 hover:bg-gray-100 lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu size={22} />
      </button>

      <h1 className="text-lg font-semibold text-gray-800">
        Bank Account Management
      </h1>
    </header>
  );
}

export default Navbar;