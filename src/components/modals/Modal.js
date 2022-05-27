import React, { useRef, useState, useEffect } from "react"

const Modal = ({ isOpen, setIsOpen, children, type }) => {
  const modalRef = useRef(null)

  const [isOpenM, setIsOpenM] = useState(isOpen)

  useEffect(() => {
    if (isOpen) setIsOpenM(isOpen)
    else {
      if (modalRef.current) {
        modalRef.current.classList.remove("open")
        modalRef.current.style.animation = "close 0.3s forwards"
      }

      setTimeout(() => {
        // setIsOpen(false)
        setIsOpenM(false)
      }, 300)
    }
  }, [isOpen])

  const closeModal = () => {
    modalRef.current.classList.remove("open")
    modalRef.current.style.animation = "close 0.3s forwards"

    setTimeout(() => {
      setIsOpen(false)
    }, 300)
  }

  return isOpenM ? (
    <div ref={modalRef} onMouseDown={closeModal} className="modal open">
      <div onMouseDown={(e) => e.stopPropagation()} className="modal__content">
        <div className="modal__container">
          <svg onClick={closeModal} className="modal__icon modal__icon--close">
            <use xlinkHref="./svg/circle.svg#circle"></use>
          </svg>
          {children}
        </div>
      </div>
    </div>
  ) : null
}

export default Modal
