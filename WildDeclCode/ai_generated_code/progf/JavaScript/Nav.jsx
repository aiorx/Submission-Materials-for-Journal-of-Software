import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "/src/images/logo/logo.svg";

/**
 * Custom React Hook: useIsMobile
 * Formed using common development resources to detect if the user is on a mobile device (viewport <= 767px).
 * Sets up a resize event listener to update the state in real-time if the window is resized.
 * Returns true if on mobile, false otherwise.
 */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 767);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 767);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

const Nav = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Determine which route/page the user is currently on.
   * isEventsRoot: Home or events list ("/" or "/events")
   * isBookingConfirmation: Booking confirmation page ("/booking/confirmation...")
   */
  const isEventsRoot =
    location.pathname === "/" || location.pathname === "/events";
  const isBookingConfirmation = location.pathname.startsWith(
    "/booking/confirmation"
  );

  /**
   * Show logo if:
   * - Not on mobile
   * - or on the events root
   * - or on booking confirmation page
   */
  const showLogo = !isMobile || isEventsRoot || isBookingConfirmation;

  /**
   * Show back arrow button if:
   * - On mobile
   * - NOT on events root
   * - NOT on booking confirmation page (where a button already exists)
   */
  const showBack = isMobile && !isEventsRoot && !isBookingConfirmation;

  const getPageTitle = (pathname) => {
    if (pathname === "/" || pathname === "/events") return "Events";
    if (pathname.startsWith("/events/booking")) return "Booking";
    if (pathname.startsWith("/events/")) return "Event Details";
    if (pathname.startsWith("/booking/confirmation"))
      return "Order Confirmation";
    if (pathname.startsWith("/bookings")) return "Bookings";
    if (pathname.startsWith("/projects")) return "Projects";
    return "";
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <nav>
      {showLogo && (
        <NavLink
          to="/events"
          className={() =>
            isEventsRoot || isBookingConfirmation
              ? "nav-link nav-logo-link active"
              : "nav-link nav-logo-link"
          }
        >
          <img src={logo} alt="Logo" />
          <h4>Ventixe</h4>
        </NavLink>
      )}
      {showBack && (
        <button
          className="nav-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go Back"
          type="button"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      )}
      {isMobile && <span className="nav-page-title">{pageTitle}</span>}

      <NavLink
        to="/events"
        className={() =>
          location.pathname === "/" ||
          location.pathname === "/events" ||
          location.pathname.startsWith("/events/")
            ? "nav-link active events"
            : "nav-link events"
        }
      >
        <span className="material-symbols-outlined">confirmation_number</span>
        <p>Events</p>
      </NavLink>
    </nav>
  );
};

export default Nav;
