import React, { ChangeEvent } from "react";
import "./SearchInput.css";
import { FaSearch } from "react-icons/fa";

interface SearchInputProps {
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Value of the input field */
  value: string;
  /** Callback function when the input value changes */
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * A custom search input component.
 */
const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Find places",
  value,
  onChange,
}) => (
  <div className="search-input">
    <span className="search-icon">
      <FaSearch />
    </span>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="search-input-field"
    />
  </div>
);

export default SearchInput;
