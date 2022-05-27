import React, { useState, useRef } from 'react'

import Modal from './Modal'
import fs from 'fs'

const NewUniSession = ({
  isOpen,
  setIsOpen,
  updateUnis,
  isUniOpened,
  setConfirmModal,
  confirmModal,
  saveUni,
  homeFolderPath,
}) => {
  const [title, setTitle] = useState('')
  const [project, setProject] = useState('')
  const [isCheckingName, setIsCheckingName] = useState(false)
  const inputRef = useRef(null)
  const btnRef = useRef(null)

  const onSubmit = (e) => {
    e.preventDefault()
    setIsCheckingName(true)
    try {
      fs.exists(homeFolderPath + `/ito/main/projects/${project}/${title}.json`, (isExists)=> {
        setIsCheckingName(false)
        if(isExists){
          console.log('no')
          inputRef.current.setCustomValidity('This file name is used !')
          btnRef.current.click()
        }else {
          console.log('yes')

          if (isUniOpened)
            setConfirmModal({
              ...confirmModal,
              title: 'Opening new file',
              message: 'Do you want to save the current file ?',
              icon: 'delete',
              isOpen: true,
              btns: [
                {
                  name: 'Save',
                  action: () => {
                    saveUni()
                    updateUnis('new-uni', { title, project })
                  },
                },
                {
                  name: "Don't Save",
                  action: () => updateUnis('new-uni', { title, project }),
                },
                {
                  name: 'Cancel',
                  action: () => {},
                },
              ],
            })
          else updateUnis('new-uni', { title, project })
          setTitle('')
          setProject('')
          setIsOpen(false)
        }
      })
      } catch (err){
        console.log(err)
        setIsCheckingName(false)
      }
    }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="modal__window modal__window--addMaster">
        <div className="modal__window__title">Create New Uni Session</div>
        <form onSubmit={onSubmit} className="modal__window__group">
          <div className="modal__window__input__group">
            <div className="modal__window__label">Title</div>
            <input
              ref={inputRef}
              className="modal__window__input"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                inputRef.current.setCustomValidity('')
              }}
              required
            ></input>
          </div>
          <div className="modal__window__input__group">
            <div className="modal__window__label">Project</div>
            <input
              className="modal__window__input"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              required
            ></input>
          </div>
          <button ref={btnRef} className={`btn ${isCheckingName ? "disable": ""}`}>
            Create
          </button>
        </form>
      </div>
    </Modal>
  )
}

export default NewUniSession
