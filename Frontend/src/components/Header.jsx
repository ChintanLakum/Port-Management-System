import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "../stores/authentication";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Header = () => {
  const navigate = useNavigate()

  useEffect(() => {
    Header
  }, [])
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { isLoggedIn, isAdmin, userProfilePhoto, isSystemAdmin, portId, userId } = useSelector(
    (state) => state.auth
  );
  const linkToAdminPort = portId
    ? `/portDetails/${portId}`
    : '/ports';
  const BACKEND_BASE_URL = 'http://localhost:5000';
  const userImage = `${userProfilePhoto}`;

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/user/logout", { method: "POST" });

      if (response.ok) {
        const data = await response.json();
        console.log("logout successful:", data);
        toast.success(data.message)
        dispatch(setLogout());
        setIsOpen(false);
      } else {
        const data = await response.json();
        toast.error(data.message)
        console.error("Logout failed:", response.status, response.statusText);
      }
    } catch (error) {
      toast.error(error.message)
      console.error("Network error during logout:", error);
    }
  };

  return (
    <div className="px-4 py-2 bg-gray-100 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={"../src/assets/logo.png"}
            alt="Website Logo"
            className="w-12 h-12 object-cover rounded-full"
          />
        </div>

        <ul className="hidden md:flex justify-center items-center space-x-8 text-lg font-medium ">
          {!isLoggedIn && (
            <>
              <Link
                to="/"
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
              >
                About Us
              </Link>
              <Link
                to="/service"
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
              >
                Services
              </Link>
              <Link
                to="/login"
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
              >
                Login
              </Link>
            </>
          )}

          {/* Case 2: Logged in admin */}
          {isLoggedIn && isAdmin && !isSystemAdmin && (
            <>
              <Link
                to="/"
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
              >
                Home
              </Link>
              <Link
                to="/ships"
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
              >
                Ships
              </Link>
              <Link
                to={`/profile/${userId}`}
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
              >
                Profile
              </Link>
              <Link
                to={linkToAdminPort}
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
                onClick={() => navigate(`/portDetails/${portId}`)}
              >
                Port Detail
              </Link>
              <img
                src={userProfilePhoto}
                alt="Profile photo"
                className="w-12 h-12 object-cover rounded-full"

              />
              <Link
                to="/"
                onClick={handleLogout}
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
              >
                Logout
              </Link>

            </>
          )}

          {/* Case 3: Logged in regular user */}
          {isLoggedIn && !isAdmin && !isSystemAdmin && (
            <>

              <Link
                to="/"
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
              >
                Home
              </Link>
              <Link
                to="/service"
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
              >
                Services
              </Link>
              <Link
                to="/track"
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
              >
                Track
              </Link>
              <Link
                to="/contact"
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
              >
                Contact Us
              </Link>
              <img
                src={userImage}
                alt="Profile photo"
                className="w-12 h-12 object-cover rounded-full"
              />
              <Link
                to="/"
                onClick={handleLogout}
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
              >
                Logout
              </Link>
            </>
          )}
          {isLoggedIn && isSystemAdmin && !isAdmin && (
            <>

              <Link
                to="/"
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
              >
                Home
              </Link>
              <Link
                to="/system"
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
              >
                System
              </Link>
              <Link
                to="/ports"
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
              >
                Ports
              </Link>
              <Link
                to="/ships"
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
              >
                Ships
              </Link>
              <img
                src={userProfilePhoto}
                alt="Profile photo"
                className="w-12 h-12 object-cover rounded-full"
              />
              <Link
                to="/"
                onClick={handleLogout}
                className="cursor-pointer m-auto hover:text-cyan-700 font-bold"
              >
                Logout
              </Link>
            </>
          )}
        </ul>

        {/* Hamburger (only visible on mobile) */}
        <div
          className="md:hidden text-2xl cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <GiHamburgerMenu />
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden mt-4 space-y-2 text-lg my-2">
          {/* Case 1: Not logged in user */}
          {!isLoggedIn && (
            <>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block hover:text-cyan-600 text-center font-bold"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className="block hover:text-cyan-600 text-center font-bold"
              >
                About Us
              </Link>
              <Link
                to="/service"
                onClick={() => setIsOpen(false)}
                className="block hover:text-cyan-600 text-center font-bold"
              >
                Services
              </Link>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block hover:text-cyan-600 text-center font-bold"
              >
                Login
              </Link>
            </>
          )}
          {/* Case 2: Logged in admin */}
          {isLoggedIn && isAdmin && !isSystemAdmin && (
            <>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block hover:text-cyan-600 text-center font-bold"
              >
                Home
              </Link>
              <Link
                to="/ships"
                onClick={() => { navigate("/ships"), setIsOpen(false) }}
                className="block hover:text-cyan-600 text-center font-bold"
              >
                Ship
              </Link>
              <Link
                to={`/profile/${userId}`}
                onClick={() => setIsOpen(false)}
                className="block hover:text-cyan-600 text-center font-bold"
              >
                Profile
              </Link>
              <Link
                to="/ports"
                onClick={() => { navigate(`/portDetails${portId}`), setIsOpen(false) }}
                className="block hover:text-cyan-600 text-center font-bold"
              >
                Port Detail
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-center hover:text-cyan-600 font-bold"
              >
                Logout
              </button>
            </>
          )}
          {/* Case 3: Logged in regular user */}
          {isLoggedIn && !isAdmin && !isSystemAdmin && (
            <>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block hover:text-cyan-600 text-center font-bold"
              >
                Home
              </Link>
              <Link
                to="/service"
                onClick={() => setIsOpen(false)}
                className="block hover:text-cyan-600 text-center font-bold"
              >
                Services
              </Link>
              <Link
                to="/track"
                onClick={() => setIsOpen(false)}
                className="block hover:text-cyan-600 text-center font-bold"
              >
                Track
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block hover:text-cyan-600 text-center font-bold"
              >
                Contact Us
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-center hover:text-cyan-600 font-bold"
              >
                Logout
              </button>
            </>
          )}
          {isLoggedIn && isSystemAdmin && !isAdmin && (
            <>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block hover:text-cyan-600 text-center font-bold"
              >
                Home
              </Link>
              <Link
                to="/system"
                onClick={() => setIsOpen(false)}
                className="block hover:text-cyan-600 text-center font-bold"
              >
                System
              </Link>
              <Link
                to="/ports"
                onClick={() => setIsOpen(false)}
                className="block hover:text-cyan-600 text-center font-bold"
              >
                Ports
              </Link>
              <Link
                to="/ships"
                onClick={() => setIsOpen(false)}
                className="block hover:text-cyan-600 text-center font-bold"
              >
                Ships
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-center hover:text-cyan-600 font-bold"
              >
                Logout
              </button>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default Header;
