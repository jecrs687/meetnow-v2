// src/components/PlaceCard.tsx
import React from "react";
import "./PlaceCard.css";
import { FaStar, FaHeart } from "react-icons/fa";

interface PlaceCardProps {
  image: string;
  title: string;
  rating: number;
  showFavorite: boolean;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  image,
  title,
  rating,
  showFavorite,
}) => (
  <div className="place-card" style={{ backgroundImage: `url(${image})` }}>
    <div className="place-card-content">
      <div className="place-card-header">
        <span className="place-card-title">{title}</span>
      </div>

      <div className="place-card-footer">
        <div className="place-card-rating">
          <FaStar color="gold" />
          <span className="rating-text">{rating}</span>
        </div>

        {showFavorite && (
          <span className="place-card-favorite">
            <FaHeart color="red" />
          </span>
        )}
      </div>
    </div>
  </div>
);

export default PlaceCard;
