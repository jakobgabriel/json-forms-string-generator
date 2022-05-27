import React from "react"

const ModalTab = ({ name, tab, lastTabIndex, className, children }) => {
  return (
    <div
      className={`tab-content ${className ? className : ""} ${
        tab || tab === undefined ? "tab-content--opened" : ""
      }`}
    >
      <span
        style={{ position: "absolute" }}
        tabIndex={1}
        onFocus={() => document.getElementById(`${name}-input-2`).focus()}
      />
      {children}
      <span
        style={{ position: "absolute" }}
        tabIndex={lastTabIndex}
        onFocus={() => document.getElementById(`${name}-input-1`).focus()}
      />
    </div>
  )
}

export default ModalTab
