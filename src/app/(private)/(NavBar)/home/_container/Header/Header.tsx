// src/components/Header.tsx
import React from "react";
import { FaAngleDown, FaMapMarkerAlt } from "react-icons/fa";
import "./Header.css";

interface HeaderProps {
  title: string;
  location: string;
  locationDetails: string;
}

/**
 * Header component with a title and location details.
 */
const Header: React.FC<HeaderProps> = ({
  title,
  location,
  locationDetails,
}) => (
  <div className="header">
    <div className="header-left">
      <span className="header-subtitle">Explore</span>
      <h1 className="header-title">{title}</h1>
    </div>
    <div className="header-right">
      <FaMapMarkerAlt className="header-location-icon" />
      <span className="header-location">
        {location} - {locationDetails}{" "}
        <FaAngleDown className="header-down-icon" />
      </span>
    </div>
  </div>
);

export default Header;
