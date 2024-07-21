// src/components/PlaceCard.tsx
import React from "react";
import "./PlaceCard.css";
import { FaStar, FaHeart } from "react-icons/fa";
import Image from "next/image";

interface PlaceCardProps {
  image: string;
  title: string;
  rating: number;
  showFavorite: boolean;
  onClick?: () => void;
  distance?: string;
  groups: number;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  image,
  title,
  rating,
  showFavorite,
  onClick,
  distance,
  groups
}) => (
  <div onClick={onClick} className="place-card">
    <Image
      src={image}
      alt={title}
      className="place-card-image"
      loading="lazy"
      width={200}
      height={200}
    />
    <div className="place-card-content">
      <div className="place-card-header">
        <span className="place-card-title">{title}</span>
      </div>

      <div className="place-card-footer">
        <div className="place-card-rating">
          <FaStar color="gold" />
          <span className="rating-text">{rating}</span>
        </div>
        <div className="place-card-rating">
          {distance} km
        </div>
        <div className="place-card-rating">
          {groups} grupos
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
