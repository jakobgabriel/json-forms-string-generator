import React from 'react'
import './sidePanel.scss'

import { NavLink, useMatch } from 'react-router-dom'

const SidePanel = ({ setIsAddModalOpen, setIsSettingsModalOpen }) => {
  const isSchemes = useMatch('/')

  console.log(isSchemes)
  return (
    <div className="sidePanel">
      <NavLink to="/">
        <svg className="sidePanel__logo">
          <use xlinkHref="./svg/logo.svg#logo"></use>
        </svg>
      </NavLink>

      <div className="sidePanel__group">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? 'sidePanel__icon sidePanel__icon--active'
              : 'sidePanel__icon'
          }
        >
          <svg>
            <use xlinkHref="./svg/layers.svg#layers"></use>
          </svg>
        </NavLink>

        <div className={`sidePanel__icon ${isSchemes ? '' : 'disable'}`}>
          <svg onClick={() => setIsAddModalOpen(true)}>
            <use xlinkHref="./svg/plus.svg#plus"></use>
          </svg>
        </div>
      </div>

      <div className="sidePanel__group__bottom">
        <NavLink
          to="/documentation"
          className={({ isActive }) =>
            isActive
              ? 'sidePanel__icon sidePanel__icon--active'
              : 'sidePanel__icon'
          }
        >
          <svg>
            <use xlinkHref="./svg/file-question.svg#file-question"></use>
          </svg>
        </NavLink>

        <div className="sidePanel__icon">
          <svg onClick={() => setIsSettingsModalOpen(true)}>
            <use xlinkHref="./svg/cog.svg#cog"></use>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default SidePanel
