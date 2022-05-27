import React from "react"

import { connect } from "react-redux"

import IndyNav from "../indy/IndyNav"
import NotesEditor from "../notes/NotesEditor"
import IndyStation from "../indy/IndyStation"
import MasterView from "../master/MasterView"

import { updateUnis } from "../../actions"
import { getActives } from "../../Funtions"

const Workstation = ({ activeIndy, notes, updateUnis, homeFolderPath }) => {
  return (
    <div className="workstation">
      <IndyNav />
      {activeIndy.type === "NOTES" ? (
        <NotesEditor updateUnis={updateUnis} />
      ) : activeIndy.type === "VIEW" ? (
        <MasterView
          activeIndy={activeIndy}
          updateUnis={updateUnis}
          homeFolderPath={homeFolderPath}
        />
      ) : activeIndy.isSourceAvailable ? (
        <IndyStation activeIndy={activeIndy} updateUnis={updateUnis} />
      ) : (
        <div className="workstation__empty">Some Sources are Missing</div>
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  let { activeMasterSession, activeIndy } = getActives(state)

  return {
    activeIndy: activeMasterSession ? activeIndy : {},
    homeFolderPath: state.settings.homeFolder,
  }
}

const mapDispatchToProps = { updateUnis }

export default connect(mapStateToProps, mapDispatchToProps)(Workstation)
