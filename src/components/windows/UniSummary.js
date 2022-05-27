import React, { useState } from "react"
import { ipcRenderer } from "electron"
import { getActives } from "../../Funtions"

import { connect } from "react-redux"

import { updateUnis } from "../../actions"

import UniSummaryNav from "./UniSummaryNav"
import UniSummaryGrid from "./UniSummaryGrid"

import store from "../.."
const UniSummary = ({ unis, activeMasterSession, activeUniVariation, updateUnis }) => {
  const randomizeOrder = () => {
    let orderedItems = {}
    Object.entries(activeUniVariation.masterSessions)
      .sort(() => Math.random() - 0.5)
      .map(([id, item]) => {
        orderedItems[id] = item
      })
    updateUnis("update-master-session-list", orderedItems)
  }

  React.useEffect(() => {
    console.log("FROM UNI SUMMARY")
    const linkState = (e, newState) => {
      // console.log(newState)
      // setState({ ...state, ...newState })
      store.dispatch({
        type: "UPDATEUNIS",
        payload: {
          type: "update-uni",
          data: newState.unis,
        },
      })
    }
    ipcRenderer.on("state", linkState)
    return () => ipcRenderer.removeListener("state", linkState)
  }, [])

  return (
    <div className="uni-summary">
      <UniSummaryNav unis={unis} updateUnis={updateUnis} />
      <UniSummaryGrid
        unis={unis}
        updateUnis={updateUnis}
        activeMasterSession={activeMasterSession}
        activeUniVariation={activeUniVariation}
      />
      <div className="uni-summary__group">
        <div onClick={randomizeOrder} className="btn btn--all">
          Randomize Nodes
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  let { activeUniVariation, activeMasterSession } = getActives(state)

  return {
    unis: state.unis,
    activeUniVariation,
    activeMasterSession,
  }
}

export default connect(mapStateToProps, { updateUnis })(UniSummary)
