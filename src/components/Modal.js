import React, { useState } from 'react';
import './Modal.css';
import { FaSearch } from 'react-icons/fa';
import ProductSelection from './ProductSelection';

const Modal = ({ isOpen, onClose, children }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleModalClick = (e) => {
    if (e.target.className === 'modal') {
      onClose();
    }
  };

  const handleSearchContainerFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchContainerBlur = () => {
    setIsSearchFocused(false);
  };

  return (
    <div className="modal" onClick={handleModalClick}>
      <div className="modal-content dialog-box">
        <div className="header">
          <h1>Select Product</h1>
          <button className="close" onClick={onClose}>&times;</button>
        </div>

        <div className="separator"></div>

        <div 
          className={`search-container ${isSearchFocused ? 'focused' : ''}`}
          onFocus={handleSearchContainerFocus}
          onBlur={handleSearchContainerBlur}
        >
          <button className="search-button">
            <FaSearch />
          </button>
          <input type="text" className="search-input" placeholder="Search for a product..." />
        </div>

        
        
        
        {children}
      </div>
    </div>
  );
};

export default Modal;