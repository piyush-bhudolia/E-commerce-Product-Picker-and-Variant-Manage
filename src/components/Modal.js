import React, { useEffect, useState } from "react";
import "./Modal.css";
import { FaSearch } from "react-icons/fa";
import _ from "lodash";
 
const Modal = ({ isOpen, onClose, children, onSearch }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const debouncedSearch = _.debounce((term) => {
      console.log({ term });
      onSearch(term);
    }, 200);
 
    debouncedSearch(searchTerm);
 
    return () => debouncedSearch.cancel();
  }, [searchTerm]);
 
  if (!isOpen) {
    return null;
  }
 
  const handleModalClick = (e) => {
    if (e.target.className === "modal") {
      onClose();
    }
  };
 
  const handleSearchContainerFocus = () => {
    setIsSearchFocused(true);
  };
 
  const handleSearchContainerBlur = () => {
    setIsSearchFocused(false);
  };
 
  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    // onSearch(newSearchTerm);
  };
 
  return (
    <div className="modal" onClick={handleModalClick}>
      <div className="modal-content dialog-box">
        <div className="header">
          <h1>Select Product</h1>
          <button className="close" onClick={onClose}>
            &times;
          </button>
        </div>
 
        <div className="separator"></div>
 
        <div
          className={`search-container ${isSearchFocused ? "focused" : ""}`}
          onFocus={handleSearchContainerFocus}
          onBlur={handleSearchContainerBlur}
        >
          <button className="search-button">
            <FaSearch />
          </button>
          <input
            type="text"
            className="search-input"
            placeholder="Search for a product..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
 
        {children}
      </div>
    </div>
  );
};
 
export default Modal;