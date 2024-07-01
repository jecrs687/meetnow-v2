// TablesCards.tsx
import React from 'react';
import { FaShareAlt } from 'react-icons/fa';
import './TablesCards.css';
import { MdOutlineTableBar } from "react-icons/md";

interface TablesCardsProps {
  name: string;
  age: number;
  description: string;
  participants: number;
  avatar: string;
}

const TablesCards: React.FC<TablesCardsProps> = ({ name, age, description, participants, avatar, }) => {
  return (
    <div className="card">
      <div className="card-content">
        <div className="card-header">
          <img className="avatar" src={avatar} alt={name} />
          <div className="card-title">
            <h6>
              {name}, {age}
            </h6>
            <p>{description}</p>
          </div>
          <button className="share-button">
            <FaShareAlt />
          </button>
        </div>
      </div>
      <div className="card-actions">
        <span className="participate-button">Participar</span>
        <div className="participants">
          {participants}
          <MdOutlineTableBar className="bed-icon" />
        </div>
      </div>
    </div>
  );
};

export default TablesCards;
