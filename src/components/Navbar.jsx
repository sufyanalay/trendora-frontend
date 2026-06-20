import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import navbarLogo from "../assets/navbar-logo.png";
const navLinks = [
  { label: "Home", to: "/" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Features", to: "/features" },
  { label: "Pricing", to: "/pricing" },
  { label: "Trending Creators", to: "/trending-creators" },
  { label: "Opportunities", to: "/opportunities" },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100"
          : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 hover:scale-105">
            <img
              src={navbarLogo}
              alt="Trendora Logo"
              className="object-contain w-12 h-12"
            />
            <span className="text-2xl font-extrabold tracking-tight text-purple-700">
              Trendora
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="items-center hidden gap-3 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium transition-all duration-300 ease-out relative ${
                  location.pathname === link.to
                    ? "text-purple-700 scale-105"
                    : "text-gray-600 hover:text-purple-700 hover:scale-105"
                }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="items-center hidden gap-3 md:flex">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-purple-700 transition-all duration-300 rounded-lg hover:bg-purple-50 hover:text-purple-800 hover:scale-105"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 text-sm font-medium text-white transition-all duration-300 shadow-sm bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl hover:shadow-lg hover:scale-105"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 text-gray-600 transition-all duration-300 rounded-lg md:hidden hover:bg-purple-50"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <Icon
                icon="solar:close-circle-bold"
                className="text-3xl text-purple-700"
              />
            ) : (
              <Icon
                icon="solar:hamburger-menu-outline"
                className="text-purple-700 text-3xl"
              />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="py-3 bg-white border-t border-gray-100 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  location.pathname === link.to
                    ? "text-purple-700 bg-purple-50 scale-105"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:scale-105 hover:translate-x-1"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 px-4 pt-3 mt-2 border-t border-gray-100">
              <Link
                to="/login"
                className="flex-1 py-2 text-sm font-medium text-center text-purple-700 border border-purple-300 rounded-lg hover:scale-105 "
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="flex-1 py-2 text-sm font-medium text-center text-white bg-purple-600 rounded-lg hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
