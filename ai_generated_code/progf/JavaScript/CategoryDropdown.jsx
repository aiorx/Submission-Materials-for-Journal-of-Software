import React, { useState, useRef, useEffect } from "react";


// Dropdown Crafted with standard coding tools

/**
* Props:
*  - categories: Array of category strings to show as options.
*  - selectedCategory: The currently selected category (string).
*  - setSelectedCategory: Function to update selected category in parent.
*  - placeholder: Placeholder text (default: "All Category").
*/

const CategoryDropdown = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  placeholder = "All Category",
}) => {
  const [open, setOpen] = useState(false); // Is dropdown open?
  const ref = useRef(); // To detect clicks outside dropdown

  // Close dropdown if user clicks outside of component
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (cat) => {
    setOpen(false);
    setSelectedCategory(cat);
  };

  return (
    <div className="custom-dropdown category-dropdown" ref={ref} tabIndex={0}>
      <button
        className="dropdown-toggle"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {selectedCategory || placeholder}
        <span className="material-symbols-outlined chevron">expand_more</span>
      </button>
      {open && (
        <ul className="dropdown-menu">
          <li
            className={!selectedCategory ? "active" : ""}
            onClick={() => handleSelect("")}
            tabIndex={0}
          >
            {placeholder}
          </li>
          {categories.map((cat) => (
            <li
              key={cat}
              className={selectedCategory === cat ? "active" : ""}
              onClick={() => handleSelect(cat)}
              tabIndex={0}
            >
              {cat}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryDropdown;
