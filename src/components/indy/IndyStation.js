import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'

import SourceGroupModule from './SourceGroupModule'
import TakesGroupModule from './TakesGroupModule'

import { getActives, generateCombo, isObjectEmpty } from '../../Funtions'

import { updateRecentGen } from '../../actions'

const IndyStation = ({
  activeIndy,
  updateUnis,
  activeMasterSession,
  activeIndyVariation,
  homeFolderPath,
}) => {
  const [isDoubleGroups, setIsDoubleGroups] = useState(false)

  const generateTop = () => {
    if (isDoubleGroups) {
      const combo1 = generateCombo(activeIndy.data, {
        ...activeIndyVariation.comboValues.a,
      })
      const combo2 = generateCombo(activeIndy.data, {
        ...activeIndyVariation.comboValues.b,
      })

      updateUnis(
        'update-indy',
        {
          comboValues: { a: combo1.comboValues, b: combo2.comboValues },
          combo: { a: combo1.combo, b: combo2.combo },
        },
        activeIndyVariation.id
      )
    } else {
      const { combo, comboValues } = generateCombo(activeIndy.data, {
        ...activeIndyVariation.comboValues.a,
      })
      updateUnis(
        'update-indy',
        {
          comboValues: { ...activeIndyVariation.comboValues, a: comboValues },
          combo: { ...activeIndyVariation.combo, a: combo },
        },
        activeIndyVariation.id
      )
    }
  }

  const resetIndy = () => {
    let resetedComboValues = {}

    Object.entries(activeIndyVariation.comboValues).map(([key, value]) => {
      let resetedvalue = {}

      Object.entries(value).map(([key, value]) => {
        resetedvalue[key] = { value: '', isLocked: false, isDisabled: false }
      })

      resetedComboValues[key] = resetedvalue
    })
    updateUnis(
      'update-indy',
      {
        combo: { a: '', b: '' },
        comboValues: resetedComboValues,
        savedTakes: {},
      },
      activeIndyVariation.id
    )
  }

  const generateTopCallback = useCallback(
    (e) => {
      if (e.key === '`' && activeIndy.isSourceAvailable) generateTop()
    },
    [isDoubleGroups, activeIndy, activeIndyVariation]
  )

  useEffect(() => {
    document.body.addEventListener('keyup', generateTopCallback)
    return () => document.body.removeEventListener('keyup', generateTopCallback)
  }, [generateTopCallback])

  return (
    <div
      className={`indy-station ${
        activeIndy.isSourceAvailable ? '' : 'disable'
      }`}
    >
      <div className="indy-station__title">{activeIndy.title}</div>

      <div className="indy-station__btn__group indy-station__btn__group--1">
        <div className="btn btn--master">Toggle View</div>
        <div
          onClick={() => setIsDoubleGroups(!isDoubleGroups)}
          className="btn btn--master"
        >
          {isDoubleGroups ? 'Single SG' : 'Duplicate SG'}
        </div>
      </div>

      <div className="indy-station__btn__group indy-station__btn__group--2">
        <div
          onClick={resetIndy}
          className={`btn btn--master ${
            isObjectEmpty(activeIndyVariation.savedTakes) ? 'disable' : ''
          }`}
        >
          Reset Indy
        </div>
        <div onClick={generateTop} className="btn btn--master">
          Generate Top
        </div>
      </div>

      <div className="source-group">
        {isDoubleGroups ? (
          <>
            <SourceGroupModule
              holder="a"
              activeIndy={activeIndy}
              activeMasterSession={activeMasterSession}
              updateUnis={updateUnis}
              activeIndyVariation={activeIndyVariation}
              homeFolderPath={homeFolderPath}
            />
            <SourceGroupModule
              holder="b"
              activeIndy={activeIndy}
              activeMasterSession={activeMasterSession}
              updateUnis={updateUnis}
              activeIndyVariation={activeIndyVariation}
              homeFolderPath={homeFolderPath}
            />
          </>
        ) : (
          <SourceGroupModule
            holder="a"
            activeIndy={activeIndy}
            activeMasterSession={activeMasterSession}
            updateUnis={updateUnis}
            activeIndyVariation={activeIndyVariation}
            homeFolderPath={homeFolderPath}
          />
        )}
      </div>
      <div className="takes-group">
        <TakesGroupModule
          activeIndy={activeIndy}
          activeMasterSession={activeMasterSession}
          updateUnis={updateUnis}
          activeIndyVariation={activeIndyVariation}
          homeFolderPath={homeFolderPath}
        />
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  let { activeMasterSession, activeIndy, activeIndyVariation } =
    getActives(state)

  return {
    activeIndy,
    activeMasterSession,
    activeIndyVariation,
    homeFolderPath: state.settings.homeFolder,
  }
}

export default connect(mapStateToProps, { updateRecentGen })(IndyStation)
