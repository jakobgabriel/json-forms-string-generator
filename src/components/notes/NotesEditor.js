import React, { useRef } from "react"
import { connect } from "react-redux"
import JoditEditor from "jodit-react"

import { getActives } from "../../Funtions"

import NotesNav from "./NotesNav"

const NotesEditor = ({ noteData, activeMasterSession, updateUnis }) => {
  const editor = useRef(null)

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
  }

  return (
    <>
      <NotesNav updateUnis={updateUnis} />
      <JoditEditor
        ref={editor}
        value={noteData.note}
        config={config}
        tabIndex={1} // tabIndex of textarea
        // onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
        onBlur={(newContent) =>
          updateUnis("update-master-session", {
            notes: {
              ...activeMasterSession.notes,
              [noteData.id]: { ...noteData, note: newContent },
            },
          })
        }
      />
    </>
  )
}

const mapStateToProps = (state) => {
  let { activeMasterSession, activeIndy } = getActives(state)

  return {
    activeMasterSession: activeMasterSession ? activeMasterSession : {},
    noteData: activeMasterSession
      ? activeMasterSession.notes[activeMasterSession.activeNote.id]
      : { note: "", id: "" },
  }
}

export default connect(mapStateToProps)(NotesEditor)
