import storypath from "/assets/images/storypath.png";
import { Link } from "react-router-dom";
import CustomButton from "./CustomButton";

/**
 * Header Component
 *
 * This component renders the header section of the application, which includes the logo,
 * navigation links, and a button to create a new project. The header is responsive, adjusting
 * its layout for different screen sizes.
 *
 * @component
 * @returns {JSX.Element} The rendered Header component.
 *
 * @example
 * return (
 *   <Header />
 * )
 *
 * JSDoc comments above were Aided using common development resources
 */
const Header = () => {
  return (
    <header className="w-full py-2 sm:px-10 px-5 text-black flex justify-between items-center bg-white">
      <nav className="flex w-full flex-col sm:flex-row items-center sm:justify-between">
        {/* Logo */}
        <Link to="/">
          <img
            src={storypath}
            alt="StoryPath Logo"
            width={300}
            className="object-contain"
          />
        </Link>

        {/* Navigation Links (on the right) */}
        <ul className="ml-auto flex space-x-8 items-center">
          <li>
            <Link to="/" className="text-lg font-medium hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/projects"
              className="text-lg font-medium hover:underline"
            >
              Projects
            </Link>
          </li>
          <li>
            {/* Use CustomButton with the "to" prop for navigation */}
            <CustomButton
              label="Create New Project"
              className="bg-accent text-white hover:bg-accent-dark py-2 rounded-2xl"
              to="/project/new"
            />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
