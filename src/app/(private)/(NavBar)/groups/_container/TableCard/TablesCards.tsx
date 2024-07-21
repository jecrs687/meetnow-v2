// TablesCards.tsx
import React from 'react';
import { FaShareAlt } from 'react-icons/fa';
import './TablesCards.css';
import { MdOutlineTableBar } from "react-icons/md";

interface TablesCardsProps {
  name: string;
  scheduledAt: string;
  description: string;
  participants: number;
  max: number;
  avatar: string;
  onClick?: () => void;
}

const TablesCards: React.FC<TablesCardsProps> = ({ onClick, name, scheduledAt, max, description, participants, avatar }) => {
  return (
    <div className="card" onClick={onClick}>
      <div className="card-content">
        <div className="card-header">
          <img className="avatar" src={avatar} alt={name} />
          <div className="card-title">
            <h6>
              {name}, {scheduledAt}
            </h6>
            <p>{description}</p>
          </div>
          <button className="share-button">
            <FaShareAlt />
          </button>
        </div>
      </div>
      <div className="card-actions">
        <span className="participate-button">
          {participants} Participantes
        </span>
        <div className="participants">
          {max}
          <MdOutlineTableBar className="bed-icon" />
        </div>
      </div>
    </div>
  );
};

export default TablesCards;
