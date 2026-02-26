import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";

const Navbar = ({ showLogo = false, onOpenBooking }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { activeBooking, user } = useBooking();
  const navigate = useNavigate();

  const handleBookingClick = () => {
    if (!user) {
      onOpenBooking(true); // Pass true to indicate we want to open booking after login
      return;
    }
    if (activeBooking) {
      navigate("/schedule");
    } else {
      onOpenBooking(false);
    }
  };

  return (
    <nav
      className={`flex justify-between md:justify-center items-center py-4 md:py-6 px-6 md:pr-12 w-full max-w-full z-50 ${showLogo ? "border-b border-brown-900/10" : ""}`}
    >
      {/* Mobile Logo/Brand */}
      <Link to="/" className="md:hidden flex items-center">
        <img
          src="/Saagaa-icon2.png"
          alt="SAAGA Logo"
          className="h-16 w-auto pt-1.5 object-contain mix-blend-multiply"
        />
      </Link>

      {/* Desktop Menu */}
      <div
        className={`hidden md:flex items-center w-full ${showLogo ? "justify-between" : "justify-center gap-16 lg:gap-24"}`}
      >
        {showLogo && (
          <Link to="/" className="flex items-center">
            <img
              src="/Saagaa-icon5.png"
              alt="SAAGA Logo"
              className="h-15 md:h-15 pt-1.5 w-auto object-contain mix-blend-multiply"
            />
          </Link>
        )}

        <div
          className={`flex items-center ${showLogo ? "gap-8 lg:gap-18" : "gap-16 lg:gap-24"}`}
        >
          <Link
            to="/services"
            className="text-brown-900 text-base font-normal tracking-[0.5px] hover:opacity-80 transition-opacity"
          >
            services
          </Link>
          <Link
            to="/shop"
            className="text-brown-900 text-base font-normal tracking-[0.5px] hover:opacity-80 transition-opacity"
          >
            shop
          </Link>
          <Link
            to="/offers"
            className="text-brown-900 text-base font-normal tracking-[0.5px] hover:opacity-80 transition-opacity"
          >
            offers
          </Link>
          <Link
            to="/#locate"
            className="text-brown-900 text-base font-normal tracking-[0.5px] hover:opacity-80 transition-opacity"
          >
            locate us
          </Link>
          <button
            onClick={handleBookingClick}
            className="px-8 py-3 text-base text-brown-900 font-medium tracking-[0.5px] border border-brown-600 rounded-full hover:bg-brown-600 hover:text-white transition-all duration-300 ring-1 ring-brown-900 ring-offset-2 ring-offset-[#FAF9F6]"
          >
            {activeBooking ? "My Schedule" : "Schedule Visit"}
          </button>
        </div>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden text-brown-900 p-2"
        onClick={() => setIsMenuOpen(true)}
      >
        <Menu size={28} />
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#FAF9F6] z-50 flex flex-col justify-center items-center transition-transform duration-500 ease-in-out ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <button
          className="absolute top-6 right-6 text-brown-900 p-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <X size={32} />
        </button>

        <div className="flex flex-col gap-8 text-center">
          <Link
            to="/services"
            onClick={() => setIsMenuOpen(false)}
            className="text-brown-900 text-3xl font-serif"
          >
            Services
          </Link>
          <Link
            to="/shop"
            onClick={() => setIsMenuOpen(false)}
            className="text-brown-900 text-3xl font-serif"
          >
            Shop
          </Link>
          <Link
            to="/offers"
            onClick={() => setIsMenuOpen(false)}
            className="text-brown-900 text-3xl font-serif"
          >
            Offers
          </Link>
          <Link
            to="/#locate"
            onClick={() => setIsMenuOpen(false)}
            className="text-brown-900 text-3xl font-serif"
          >
            Locate Us
          </Link>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleBookingClick();
            }}
            className="mt-4 px-10 py-4 text-lg text-brown-900 border border-brown-900 rounded-full ring-1 ring-brown-900 ring-offset-2 ring-offset-[#FAF9F6]"
          >
            {activeBooking ? "My Schedule" : "Schedule Visit"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
