import React, { useState, useRef } from 'react'
import Modal from './Modal'

import fs from 'fs'

const NamingModal = ({
  isOpen,
  setIsOpen,
  action,
  project,
  homeFolderPath,
}) => {
  const [title, setTitle] = useState('')
  const [isCheckingName, setIsCheckingName] = useState(false)

  const inputRef = useRef(null)
  const btnRef = useRef(null)

  const onSubmit = (e) => {
    e.preventDefault()
    setIsCheckingName(true)
    try {
      fs.exists(
        homeFolderPath + `/ito/main/projects/${project}/${title}.json`,
        (isExists) => {
          setIsCheckingName(false)
          if (isExists) {
            inputRef.current.setCustomValidity('This file name is used !')
            btnRef.current.click()
          } else {
            action(title)
            setTitle('')
            setIsOpen(false)
          }
        }
      )
    } catch (err) {
      console.log(err)
      setIsCheckingName(false)
    }
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="modal__window modal__window--namming">
        <div className="modal__window__title">Enter A Title</div>
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

          <button
            ref={btnRef}
            className={`btn ${isCheckingName ? 'disable' : ''}`}
          >
            {isCheckingName ? (
              <div class="lds-spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              'Save'
            )}
          </button>
        </form>
      </div>
    </Modal>
  )
}

export default NamingModal
