import React from 'react'
import './sidePanel.scss'

const SidePanel = ({ setIsAddModalOpen, setIsSettingsModalOpen }) => {
  return (
    <div className='sidePanel'>
      <svg className='sidePanel__logo'>
        <use xlinkHref='./svg/logo.svg#logo'></use>
      </svg>

      <div className='sidePanel__group'>
        <div className='sidePanel__icon sidePanel__icon--active'>
          <svg>
            <use xlinkHref='./svg/layers.svg#layers'></use>
          </svg>
        </div>

        <div className='sidePanel__icon'>
          <svg onClick={() => setIsAddModalOpen(true)}>
            <use xlinkHref='./svg/plus.svg#plus'></use>
          </svg>
        </div>
      </div>
      <div className='sidePanel__icon'>
        <svg
          onClick={() => setIsSettingsModalOpen(true)}
          className='sidePanel__icon'
        >
          <use xlinkHref='./svg/cog.svg#cog'></use>
        </svg>
      </div>
    </div>
  )
}

export default SidePanel
