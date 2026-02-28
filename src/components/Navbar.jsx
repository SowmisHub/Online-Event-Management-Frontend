import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          <span>Event</span>
          <span className="text-blue-600">Hub</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-gray-600 font-medium">
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <Link to="/speakers">Speakers</Link>
          <Link to="/sponsors">Sponsors</Link>
          <Link to="/pricing">Pricing</Link>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-purple-600">
            Log In
          </Link>
          <Link
            to="/signup"
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="flex flex-col px-6 py-6 space-y-5 text-gray-700 font-medium text-lg">

            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/events" onClick={() => setOpen(false)}>Events</Link>
            <Link to="/speakers" onClick={() => setOpen(false)}>Speakers</Link>
            <Link to="/sponsors" onClick={() => setOpen(false)}>Sponsors</Link>
            <Link to="/pricing" onClick={() => setOpen(false)}>Pricing</Link>

            <div className="pt-4 border-t flex flex-col space-y-4">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="text-left"
              >
                Log In
              </Link>

              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg text-center"
              >
                Sign Up
              </Link>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;