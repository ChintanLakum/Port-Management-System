import { useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";


const CustomDropdown = ({ options, selected, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="relative inline-block w-full">
        <button
          type="button"
          className="w-full p-3 text-left text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected}
          <span className="ml-2 inline-block float-right mt-1 text-2xl"><HiOutlineChevronDown /></span>
        </button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-cyan-700 hover:text-white transition-colors duration-200"
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

export default CustomDropdown;

