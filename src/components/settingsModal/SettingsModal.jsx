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
            <span className="settingsModal__licence__content">
              <p>MIT License</p>
              <br></br>
              <p>Copyright (c) 2022 Jakob Gabriel</p>
              <br></br>
              <p>
                Permission is hereby granted, free of charge, to any person
                obtaining a copy of this software and associated documentation
                files (the "Software"), to deal in the Software without
                restriction, including without limitation the rights to use,
                copy, modify, merge, publish, distribute, sublicense, and/or
                sell copies of the Software, and to permit persons to whom the
                Software is furnished to do so, subject to the following
                conditions:
              </p>
              <br></br>
              <p>
                The above copyright notice and this permission notice shall be
                included in all copies or substantial portions of the Software.
              </p>
              <br></br>
              <p>
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
                OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
                NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
                HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
                WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
                FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
                OTHER DEALINGS IN THE SOFTWARE.
              </p>
            </span>
          </div>
        </div>
      </form>
    </Dialog>
  )
}

export default SettingsModal
