import React from 'react';
import './Button.css';

interface GradientButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

/**
 * A custom button component with gradient background.
 */
const GradientButton: React.FC<GradientButtonProps> = ({ label, onClick, variant = 'primary' }) => (
  <button className={`button ${variant}`} onClick={onClick}>
    {label}
  </button>
);

export default GradientButton;
