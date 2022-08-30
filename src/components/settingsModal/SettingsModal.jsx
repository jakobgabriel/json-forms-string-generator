import React from 'react'
import { Dialog } from '@mui/material'
import './settingsModal.scss'

const { version } = require('../../../package.json')

const SettingsModal = ({ open, onClose }) => {
  const onSubmit = (e) => {
    e.preventDefault()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={onSubmit} className="settingsModal">
        <svg onClick={onClose} className="settingsModal__close">
          <use xlinkHref="./svg/close.svg#close"></use>
        </svg>
        <h2 className="settingsModal__title">Settings</h2>

        <div className="settingsModal__body">
          <div className="settingsModal__version">
            <span className="settingsModal__version__title">Version</span>
            <span className="settingsModal__version__number">{version}</span>
          </div>

          <div className="settingsModal__licence">
            <span className="settingsModal__licence__title">Licence</span>
            <span>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
              repellendus aperiam in officiis hic facere fugit praesentium nemo
              quasi. Quis recusandae facere molestias voluptate expedita
              reiciendis ipsa corporis saepe quo.
            </span>
          </div>
        </div>
      </form>
    </Dialog>
  )
}

export default SettingsModal
