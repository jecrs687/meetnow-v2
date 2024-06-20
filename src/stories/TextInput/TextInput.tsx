// src/components/TextInput.tsx
import React, { ChangeEvent } from 'react';
import './TextInput.css';

interface TextInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  icon?: React.ReactNode;
}

/**
 * A custom input component with an optional icon.
 */
const TextInput: React.FC<TextInputProps> = ({ label, placeholder, value, onChange, type = 'text', icon }) => (
  <div className="text-input">
    <div className="text-input-wrapper">
      {icon && <span className="text-input-icon">{icon}</span>}
      <div className="text-input-inner-wrapper">
        <label className="text-input-label">{label}</label>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="text-input-field"
        />
      </div>
    </div>
  </div>
);

export default TextInput;
