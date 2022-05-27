import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { updateSettings, moveHomeFolder } from '../../actions'

import Modal from './Modal'
import Switch from '../main/Switch'

const SettingsModal = ({ isOpen, setIsOpen, settings, updateSettings }) => {
  const [path, setPath] = useState(settings.homeFolder)

  const [isAutoSave, setIsAutoSave] = useState(settings.autoSave)

  const openDir = () => {
    const { dialog, BrowserWindow } = require('@electron/remote')

    dialog
      .showOpenDialog(BrowserWindow.getFocusedWindow(), {
        properties: ['openDirectory'],
      })
      .then((result) => {
        if (!result.canceled) {
          setPath(result.filePaths[0].replaceAll("\\","/"))
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    setPath(settings.homeFolder)
    setIsAutoSave(settings.autoSave)
  }, [isOpen])

  const onSubmit = (e) => {
    e.preventDefault()

    updateSettings({ autoSave: isAutoSave, homeFolder: path })

    if (settings.homeFolder !== path.replaceAll('\\', '/')) {
      moveHomeFolder(settings.homeFolder + '/ito', path.replaceAll('\\', '/') + '/ito')
    }

    setIsOpen(false)
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="modal__window modal__window--addMaster">
        <div className="modal__window__title">Settings</div>

        <form onSubmit={onSubmit} className="modal__window__group">
          <div className="modal__window__input__group">
            <div className="modal__window__label modal__window__label--settings">
              Home Folder
            </div>

            <input
              value={path}
              onChange={() => {}}
              spellCheck={false}
              className="modal__window__input"
            ></input>

            <label onClick={openDir} htmlFor="file-input" className="btn">
              Open
            </label>
          </div>

          <div className="modal__window__input__group">
            <div className="modal__window__label modal__window__label--settings">
              Auto Save
            </div>

            <Switch
              value={isAutoSave}
              setValue={() => setIsAutoSave(!isAutoSave)}
              id="general-input-2"
              tabIndex={4}
            />
          </div>

          <button className="btn">Save</button>
        </form>
      </div>
    </Modal>
  )
}

const mapStateToProps = (state) => ({
  settings: state.settings,
})

const mapDispatchToProps = { updateSettings }

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal)
