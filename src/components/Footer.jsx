import { Link } from "react-router-dom";
import navbarLogo from "../assets/navbar-logo.png";
export default function Footer() {
  return (
    <footer className="pt-20 pb-8 text-gray-300 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 mb-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img
                src={navbarLogo}
                alt="Trendora Logo"
                className="object-contain w-12 h-12"
              />

              <span className="text-2xl font-bold text-white">Trendora</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Create. Connect. Grow.
              <br />
              Pakistan's creator-brand collaboration platform.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="mb-4 text-sm font-bold tracking-wider text-white uppercase">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="inline-block transition-all duration-300 hover:text-purple-400 hover:translate-x-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="inline-block transition-all duration-300 hover:text-purple-400 hover:translate-x-1"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="inline-block transition-all duration-300 hover:text-purple-400 hover:translate-x-1"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="inline-block transition-all duration-300 hover:text-purple-400 hover:translate-x-1"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/opportunities"
                  className="inline-block transition-all duration-300 hover:text-purple-400 hover:translate-x-1"
                >
                  Opportunities
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-bold tracking-wider text-white uppercase">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="inline-block transition-all duration-300 hover:text-purple-400 hover:translate-x-1"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="inline-block transition-all duration-300 hover:text-purple-400 hover:translate-x-1"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/trending-creators"
                  className="inline-block transition-all duration-300 hover:text-purple-400 hover:translate-x-1"
                >
                  Trending Creators
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-bold tracking-wider text-white uppercase">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacy-policy"
                  className="inline-block transition-all duration-300 hover:text-purple-400 hover:translate-x-1"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="inline-block transition-all duration-300 hover:text-purple-400 hover:translate-x-1"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-12 text-sm text-center text-gray-500 border-t border-slate-800">
          © {new Date().getFullYear()} Trendora. Built for creators & brands.
        </div>
      </div>
    </footer>
  );
}
