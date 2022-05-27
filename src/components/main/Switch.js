import React from "react"

const Switch = ({ value, setValue, className, tabIndex, id, onClick }) => {
  return (
    <div className="toggle checkcross">
      <input
        id="checkcross"
        type="checkbox"
        checked={value ? value : false}
        onChange={() => setValue(id)}
      />
      <label
        id={id}
        tabIndex={tabIndex ? tabIndex : 0}
        className={`toggle-item ${className}`}
        htmlFor="checkcross"
        onClick={onClick}
      >
        <div className="check"></div>
      </label>
    </div>
  )
}

export default Switch
