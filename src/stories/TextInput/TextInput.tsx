// src/components/TextInput.tsx
import React, { ChangeEvent } from "react";
import "./TextInput.css";

interface TextInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  type?: string;
  icon?: React.ReactNode;
  multiline?: boolean;
}

/**
 * A custom input component with an optional icon.
 */
const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  icon,
  multiline = false,
}) => (
  <div className="text-input">
    <div className="text-input-wrapper">
      {icon && <span className="text-input-icon">{icon}</span>}
      <div className="text-input-inner-wrapper">
        <label className="text-input-label">{label}</label>
        {multiline ? (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="text-input-field text-input-textarea"
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="text-input-field"
          />
        )}
      </div>
    </div>
  </div>
);

export default TextInput;
