import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'

import { updateUnis, updateUniSession } from '../../actions'

import { getActives } from '../../Funtions'
import { ipcRenderer } from 'electron'

import SettingsModal from '../modals/SettingsModal'

const Header = ({ title, updateUnis, updateUniSession, isSaved }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const notifyRef = useRef(null)

  useEffect(() => {
    console.log('setting notify')

    window.tess = () => console.log('works !')
    let id
    let isNorifing = false
    window.notify = (message) => {
      if (isNorifing) {
        clearTimeout(id)
        notifyRef.current.style.opacity = 0
        setTimeout(() => {
          isNorifing = true
          notifyRef.current.innerText = message
          notifyRef.current.style.opacity = 1

          id = setTimeout(() => {
            notifyRef.current.style.opacity = 0
            isNorifing = false
          }, 1500)
        }, 250)
      } else {
        isNorifing = true
        notifyRef.current.innerText = message
        notifyRef.current.style.opacity = 1

        id = setTimeout(() => {
          notifyRef.current.style.opacity = 0
          isNorifing = false
        }, 1500)
      }
    }
    ipcRenderer.on('notify', (e, { message }) => {
      window.notify(message)
    })

    ipcRenderer.on('log', (e, d) => console.log(d))
  }, [])

  const [cValue, setCvalue] = useState('')

  useEffect(() => {
    setCvalue(title)
  }, [title])

  const [isEditing, setIsEditing] = useState(false)
  const itemRef = useRef(null)

  let removal = null

  useEffect(() => {
    if (isEditing) {
      // let circle = itemRef.current.children[0]
      let input = itemRef.current.children[0]
      let span = itemRef.current.children[1]

      var stopEdit = () => {
        // circle.style.visibility = 'visible'
        input.style.display = 'none'
        span.style.display = 'initial'

        document.body.removeEventListener('click', stopEdit)
        setIsEditing(false)
        if (cValue !== title) updateUniSession({ title: cValue })
      }
      removal = stopEdit
      document.body.addEventListener('click', stopEdit)
    }

    return () => document.body.removeEventListener('click', stopEdit)
  }, [cValue, isEditing])

  return (
    <div className="header">
      <div
        ref={itemRef}
        onClick={(e) => e.stopPropagation()}
        className="header__title"
        onDoubleClick={(e) => {
          console.log(e.currentTarget)
          if (window.location.hash.split('/').slice(-1)[0] === 'dashboard') {
            // let circle = e.currentTarget.children[0]
            let input = e.currentTarget.children[0]
            let span = e.currentTarget.children[1]

            // circle.style.visibility = 'hidden'
            input.style.display = 'initial'
            span.style.display = 'none'

            setIsEditing(true)
          }
        }}
      >
        {/* <svg
          style={{ display: isSaved ? 'none' : 'initial' }}
          className="header__title__icon header__title__icon--save"
        >
          <use xlinkHref="./svg/circle.svg#circle"></use>
        </svg> */}
        <input
          style={{ display: 'none' }}
          className="hidden-input hidden-input--uni"
          // value={title ? title : " "}
          value={cValue ? cValue : ' '}
          onChange={(e) => setCvalue(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              // e.currentTarget.previousSibling.style.visibility = 'visible'
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextSibling.style.display = 'initial'

              if (cValue !== title) updateUniSession({ title: cValue })
              document.body.removeEventListener('click', removal)
            }
          }}
        ></input>

        <span>{title ? title : ''}</span>
      </div>

      <div
        ref={notifyRef}
        id="notify"
        style={{
          position: 'absolute',
          right: '4rem',
          opacity: 0,
          transition: 'all 0.5s',
        }}
      ></div>

      {window.location.hash.includes("dashboard") ? (
        <>
          <svg
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="header__icon"
          >
            <use xlinkHref="./svg/cog.svg#cog"></use>
          </svg>

          <SettingsModal
            isOpen={isSettingsOpen}
            setIsOpen={setIsSettingsOpen}
            updateUnis={updateUnis}
          />
        </>
      ) : null}
    </div>
  )
}

const mapStateToProps = (state) => {
  window.rr = state

  let { activeUniVariation } = getActives(state)

  return {
    title: state.unis ? state.unis.title : '',
    isSaved: activeUniVariation.isSaved,
    // isAutoSave: state.settings.autoSave,
  }
}

const mapDispatchToProps = { updateUnis, updateUniSession }

export default connect(mapStateToProps, mapDispatchToProps)(Header)
