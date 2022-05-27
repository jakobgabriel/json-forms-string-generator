import React from "react"

import Modal from "./Modal"

const ConfirmModal = ({ isOpen, setIsOpen, title, message, btns }) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="modal__window modal__window--confirm">
        <div className="modal__window__title">{title}</div>
        <div className="modal__window__message">{message}</div>

        <div className="modal__btn__group">
          {btns.map(({ name, action }, index) => (
            <button
              key={index}
              onClick={() => {
                action()
                setIsOpen(false)
              }}
              className="modal__btn"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmModal
