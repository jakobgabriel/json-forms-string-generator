import React, { useState } from 'react'
import { Dialog, TextField } from '@mui/material'

import './settingsModal.scss'

const SettingsModal = ({ open, onClose }) => {
  const [seperator, setSeperator] = useState(
    window.localStorage.getItem('seperator')
      ? window.localStorage.getItem('seperator')
      : ','
  )

  const onSubmit = (e) => {
    e.preventDefault()
    window.localStorage.setItem('seperator', seperator)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={onSubmit} className='settingsModal'>
        <svg onClick={onClose} className='settingsModal__close'>
          <use xlinkHref='./svg/close.svg#close'></use>
        </svg>
        <h2 className='settingsModal__title'>Settings</h2>

        <TextField
          value={seperator}
          onChange={(e) => setSeperator(e.target.value)}
          label='Seperator'
          size='small'
          required
        />

        <button className='settingsModal__btn'>
          <svg>
            <use xlinkHref='./svg/save.svg#save'></use>
          </svg>
        </button>
      </form>
    </Dialog>
  )
}

export default SettingsModal
