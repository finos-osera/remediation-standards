import React, { useId, useRef } from "react";

// Native disclosure + radio inputs provide keyboard behavior without a custom
// listbox implementation or platform-dependent select popup rendering.
export default function FilterMenu({ label, value, options, onChange }) {
  const name = useId();
  const menu = useRef(null);
  const selected = options.find((option) => option.value === value);
  const close = () => {
    menu.current.open = false;
    menu.current.querySelector("summary").focus();
  };
  return (
    <details
      className="filter-menu"
      ref={menu}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          close();
        }
      }}
    >
      <summary>
        <span className="filter-label">{label}</span>
        <span className="filter-value">
          {selected?.label}
          <span aria-hidden="true">⌄</span>
        </span>
      </summary>
      <fieldset className="filter-options">
        <legend>{label}</legend>
        {options.map((option) => (
          <label className="filter-option" key={option.value}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              onClick={close}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>
    </details>
  );
}
