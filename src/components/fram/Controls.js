import React, { useState } from "react"
const { BrowserWindow } = require("@electron/remote")

const Controls = () => {
  // minimize window
  const minimize = (e) => {
    let window = BrowserWindow.getFocusedWindow()
    window.minimize()
  }

  // Maximize window
  const maximize = (e) => {
    var window = BrowserWindow.getFocusedWindow()
    if (window.isMaximized()) {
      window.unmaximize()
    } else {
      window.maximize()
    }
  }

  // Close app
  const close = (e) => {}

  return (
    <div className="controls__container">
      <div className="controls">
        <svg onClick={minimize} className="controls__icon">
          <use xlinkHref="./svg/minus.svg#minus"></use>
        </svg>
        <svg onClick={maximize} className="controls__icon controls__icon--maximize">
          <use xlinkHref="./svg/square-full.svg#square-full"></use>
        </svg>
        <svg onClick={close} className="controls__icon controls__icon--close">
          <use xlinkHref="./svg/times.svg#times"></use>
        </svg>
      </div>
    </div>
  )
}

export default Controls
