import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import debounce from 'lodash.debounce'

import { updateUnis, saveSession } from '../../actions'
import { getActives } from '../../Funtions'

const MasterPanel = ({
  updateUnis,
  undoList,
  activeMasterSessionId,
  activeUniVariationId,
}) => {
  const debouncedSaveChangess = useMemo(
    () =>
      debounce(
        () => saveSession(activeMasterSessionId, activeUniVariationId),
        1000,
        { leading: true, trailing: false }
      ),
    [activeMasterSessionId, activeUniVariationId]
  )

  return (
    <div className="master-panel">
      <div className="master-panel__btn-group">
        {/* <div className="btn btn--master">New Session</div> */}
        {/* <div className="btn btn--master"> Open Session</div> */}

        <div onClick={debouncedSaveChangess} className="btn btn--master">
          Save Session
        </div>

        <div
          onClick={() => updateUnis('undo')}
          className={`btn btn--master ${
            undoList.length === 0 ? 'disable' : ''
          }`}
        >
          Undo
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  let { activeMasterSession, activeUniVariation } = getActives(state)
  return {
    undoList: activeMasterSession.undoList,
    activeMasterSessionId: activeMasterSession.id,
    activeUniVariationId: activeUniVariation.id,
  }
}

const mapDispatchToProps = { updateUnis }

export default connect(mapStateToProps, mapDispatchToProps)(MasterPanel)
