var Menu = require('@headlessui/react').Menu;
var Transition = require('@headlessui/react').Transition;
var Fragment = require('react').Fragment;
var useEffect = require('react').useEffect;
var useRef = require('react').useRef;
var useState = require('react').useState;
var ChevronDownIcon = require('@heroicons/react/solid').ChevronDownIcon;

module.exports = function Dropdown({ children, items }) {;
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="focus:outline-none">{children}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-40 mt-4 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2 overflow-hidden">
          {items.map(function ({ label, href, onClick }) { return (
            <Menu.Item key={label}>
              {({ active }) => {
                const classNames =
                  "block rounded-md transition-colors focus:outline-none w-full text-left px-3 py-2 text-black " +
                  (active ? "bg-gray-100" : "");

                return onClick ? (
                  <button onClick={onClick} className={classNames}>
                    {label}
                  </button>
                ) : (
                  <a href={href} className={classNames}>
                    {label}
                  </a>
                );
              }}
            </Menu.Item>
          ); })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
