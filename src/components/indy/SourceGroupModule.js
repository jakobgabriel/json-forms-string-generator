import React, { useState } from 'react'
import { ipcRenderer } from 'electron'

const SourceGroupModule = ({
  activeUniVariation,
  activeMasterSession,
  activeIndy,
  activeIndyVariation,
  updateUnis,
  holder,
  homeFolderPath,
}) => {
  const saveCombo = () => {
    if (activeMasterSession['savedCombos'][activeIndyVariation.title]) {
      if (
        !activeMasterSession['savedCombos'][activeIndyVariation.title].includes(
          activeIndyVariation.combo[holder]
        )
      ) {
        window.notify('Saving ...')
        ipcRenderer.send('save-combo', {
          readPath: activeMasterSession.path,
          combo: activeIndyVariation.combo[holder],
          title: activeIndyVariation.title,
          homeFolderPath,

          variationId: activeUniVariation.id,
          masterId: activeMasterSession.id,
        })
      } else {
        window.notify('Already Saved')
      }
    } else {
      window.notify('No corresponding saved combos column')
    }
  }

  const lockValueFromGenerating = (key) => {
    // activeIndyVariation
    updateUnis(
      'update-indy',
      {
        comboValues: {
          ...activeIndyVariation.comboValues,
          [holder]: {
            ...activeIndyVariation.comboValues[holder],
            [key]: {
              ...activeIndyVariation.comboValues[holder][key],
              isLocked: !activeIndyVariation.comboValues[holder][key].isLocked,
            },
          },
        },
      },
      activeIndyVariation.id
    )
  }

  const disableValueFromGeneration = (key) => {
    updateUnis(
      'update-indy',
      {
        comboValues: {
          ...activeIndyVariation.comboValues,
          [holder]: {
            ...activeIndyVariation.comboValues[holder],
            [key]: {
              ...activeIndyVariation.comboValues[holder][key],
              isDisabled:
                !activeIndyVariation.comboValues[holder][key].isDisabled,
            },
          },
        },
      },
      activeIndyVariation.id
    )
  }

  const unLockAll = () => {
    let currentComboValues = { ...activeIndyVariation.comboValues[holder] }
    Object.keys(currentComboValues).map((key) => {
      currentComboValues[key].isLocked = false
    })
    updateUnis(
      'update-indy',
      {
        comboValues: {
          ...activeIndyVariation.comboValues,
          [holder]: currentComboValues,
        },
      },
      activeIndyVariation.id
    )
  }

  const AddCombo = () => {
    if (
      !Object.values(activeIndyVariation.savedTakes).find(
        (data) => data.combo === activeIndyVariation.combo[holder]
      )
    ) {
      if (
        !activeMasterSession.masterView[
          activeMasterSession.activeMasterViewVariation.id
        ].takes[activeIndyVariation.title]
      ) {
        let newMasterView = {}
        Object.entries(activeMasterSession.masterView).map(([key, value]) => {
          newMasterView[key] = {
            ...activeMasterSession.masterView[key],
            takes: {
              ...activeMasterSession.masterView[key].takes,
              [activeIndyVariation.title]: {
                id: activeIndyVariation.title,
                combo: activeIndyVariation.combo[holder],
                indy: activeIndyVariation.title,
                indyId: activeIndyVariation.id,
                isLocked: false,
              },
            },
          }
        })
        updateUnis('update-master-session', {
          masterView: newMasterView,
        })
      }

      let id = crypto.randomUUID()

      updateUnis(
        'update-indy',
        {
          savedTakes: {
            ...activeIndyVariation.savedTakes,
            [id]: {
              id,
              combo: activeIndyVariation.combo[holder],
              isLocked: false,
            },
          },
        },
        activeIndyVariation.id
      )
      window.notify('Added')
    } else {
      window.notify('Already Added')
    }
  }

  return (
    <div className="source-group__module">
      <div className="source-group__module__body">
        {Object.entries(activeIndy.data).map(([key]) => (
          <div key={key} className="source-group__module__item">
            <div className="source-group__module__item__name">{key}</div>
            <div
              className={`source-group__module__item__combo ${
                activeIndyVariation.comboValues[holder][key].isDisabled
                  ? 'tored'
                  : ''
              } ${
                activeIndyVariation.comboValues[holder][key].isLocked
                  ? 'togray'
                  : ''
              }`}
            >
              {activeIndyVariation.comboValues[holder][key].value}
            </div>
            <div className="source-group__module__item__btn__group">
              <div
                onClick={() => disableValueFromGeneration(key)}
                className="btn btn--item btn--item--red "
              >
                D
              </div>
              <div
                onClick={() => lockValueFromGenerating(key)}
                className={`btn btn--item btn--item--gray ${
                  activeIndyVariation.combo[holder] === '' ? 'disable' : ''
                }`}
              >
                L
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="source-group__module__group">
        <div
          onClick={unLockAll}
          className={`btn ${
            activeIndyVariation.combo[holder] === '' ? 'disable' : 'd'
          }`}
        >
          Unlock All
        </div>
        <div
          onClick={AddCombo}
          className={`btn ${
            activeIndyVariation.combo[holder] === '' ? 'disable' : 'd'
          }`}
        >
          Add
        </div>
        <div
          onClick={saveCombo}
          className={`btn ${
            activeIndyVariation.combo[holder] === '' ? 'disable' : 'd'
          }`}
        >
          {/* <span className="ring-loader"></span> */}
          Save
        </div>
      </div>
    </div>
  )
}
export default SourceGroupModule
