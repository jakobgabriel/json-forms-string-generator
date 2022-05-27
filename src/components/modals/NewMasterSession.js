import React, { useState, useRef, useEffect, useMemo } from 'react'
import { ipcRenderer } from 'electron'

import Modal from './Modal'

const NewMasterSession = ({ isOpen, setIsOpen, updateUnis, updateIsOpen }) => {
  const [title, setTitle] = useState('')
  const [path, setPath] = useState('')

  const pathRef = useRef(null)

  useEffect(() => {
    const lisiener = (e, data) => {
      updateIsOpen({ isLoadingOpen: false })
      updateUnis('add-master-session', data)
    }
    ipcRenderer.on('readFile-reply', lisiener)
    return () => ipcRenderer.removeListener('readFile-reply', lisiener)
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    updateIsOpen({ isLoadingOpen: true })

    // console.log(path)
    // console.log(path.replaceAll('\\', '/').replaceAll("/", "\\"))

    ipcRenderer.send('readFile', path.replaceAll('\\', '/'), title)

    setPath('')
    setTitle('')
    setIsOpen(false)
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="modal__window modal__window--addMaster">
        <div className="modal__window__title">Add New Master Session</div>

        <form onSubmit={onSubmit} className="modal__window__group">
          <div className="modal__window__input__group">
            <div className="modal__window__label">Title</div>
            <input
              className="modal__window__input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            ></input>
          </div>

          <div className="modal__window__input__group">
            <div className="modal__window__label">File</div>

            <input
              className="modal__window__input"
              value={path}
              onChange={() => {}}
              pattern="^.*.(xlsx|xls|xlsm)$"
              spellCheck={false}
              required
              ref={pathRef}
            ></input>

            <label htmlFor="file-input" className="btn">
              <input
                id="file-input"
                className="modal__window__input--file"
                type="file"
                accept=".xlsx,.xls,.xlsm"
                onChange={(e) => setPath(e.target.files[0].path)}
              ></input>
              Open
            </label>
          </div>

          <button className="btn">Create</button>
        </form>
      </div>
    </Modal>
  )
}

export default NewMasterSession
