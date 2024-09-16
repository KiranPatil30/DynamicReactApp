// InputComponents.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export const TextInput = ({ name, label, placeholder, value, onChange }) => (
  <div className="form-group">
    <label htmlFor={name} className='form-label'>{label}</label>
    <input
      type="text"
      name={name}
      id={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="form-control"
       
    />

  </div>
);

export const EmailInput = ({ name, label, placeholder, value, onChange }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">{label}</label>
    <input
      type="email"
      name={name}
      id={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="form-control"
       
    />
  </div>
);

export const MobileInput = ({ name, label, placeholder, value, onChange }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">{label}</label>
    <input
      type="tel"
      name={name}
      // pattern='[7-9][0-9]{9}'
      id={name}
      placeholder={placeholder}

      value={value}
      onChange={onChange}

      className="form-control"

      //  
    />
  </div>
);
export const Multiline = ({ name, label, placeholder, value, onChange }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">{label}</label>
    <input
      type="text"
      name={name}
      id={name}
      placeholder={placeholder}

      value={value}
      onChange={onChange}
      className="form-control"
      style={{ width: '160%' }}
    />
  </div>
);

export const SelectInput = ({ name, label, options, value, onChange }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label"> {label}</label>
    <select
      name={name}
      id={name}

      value={value}
      onChange={onChange}
      className="form-control"
    >
      <option value="">Select...</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
export const TextareaInput = ({ name, label, placeholder, value, onChange }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">{label}</label>
    <textarea
      name={name}
      id={name}
      placeholder={placeholder}

      value={value}
      onChange={onChange}
      className="form-control"
       
    />
  </div>
);
export const NumberInput = ({ name, label, placeholder, value, onChange }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">{label}</label>
    <input
      type="number"
      name={name}
      id={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="form-control"
       
    />
  </div>
);
export const FileInput = ({ name, label, onChange }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">{label}</label>
    <input
      type="file"
      name={name}
      id={name}
      onChange={onChange}
      className="form-control-file"
       
    />
  </div>
);