import React from 'react'
import { connect } from 'react-redux'
import { isObjectEmpty } from '../../Funtions'

import MasterPanel from './MasterPanel'
import Workstation from './Workstation'

import { getActives } from '../../Funtions'

const Master = ({ activeMasterSession, isLoadingOpen }) => {
  return (
    <div className="master">
      {isLoadingOpen ? (
        <div className="sk-cube-grid">
          <div className="sk-cube sk-cube1"></div>
          <div className="sk-cube sk-cube2"></div>
          <div className="sk-cube sk-cube3"></div>
          <div className="sk-cube sk-cube4"></div>
          <div className="sk-cube sk-cube5"></div>
          <div className="sk-cube sk-cube6"></div>
          <div className="sk-cube sk-cube7"></div>
          <div className="sk-cube sk-cube8"></div>
          <div className="sk-cube sk-cube9"></div>
        </div>
      ) : (
        <>
          <div className="master__header">
            {isObjectEmpty(activeMasterSession) ||
            activeMasterSession === undefined
              ? ''
              : activeMasterSession.title}
          </div>
          <div className="master__body">
            {isObjectEmpty(activeMasterSession) ||
            activeMasterSession === undefined ? null : (
              <>
                <MasterPanel />
                <Workstation />
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  let { activeMasterSession } = getActives(state)
  return {
    activeMasterSession,
    isLoadingOpen: state.isOpen.isLoadingOpen,
  }
}

export default connect(mapStateToProps)(Master)
