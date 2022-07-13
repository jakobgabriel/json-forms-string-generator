import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import {
  sortableContainer,
  sortableElement,
  SortableHandle,
} from 'react-sortable-hoc'
import { arrayMoveImmutable } from 'array-move'

import { ipcRenderer } from 'electron'
import {
  isObjectEmpty,
  getActives,
  generateComboFromSaved,
  generateComboFromSavedAll,
  generateComboFromSavedAllForIndies,
  generateComboFromAddedTakesAllForIndies,
} from '../../Funtions'

import DirectDropDown from '../main/DirectDropDown'

const Handle = SortableHandle(() => (
  <svg className="takes-group__module__item__handle">
    <use xlinkHref="./svg/draggabledots.svg#draggabledots"></use>
  </svg>
))

const SortableItem = sortableElement(
  ({
    data,
    indies,
    generateComboFromSavedAction,
    lockValueFromGenerating,
    saveCombo,
    updateTakeCombo,
    ////////////////////////////
    generateComboFromIndyAction,
  }) => (
    <div className="takes-group__module__item">
      <div
        className={`takes-group__module__item__combo ${
          data.isLocked ? 'togray' : ''
        }`}
      >
        {data.combo}

        <DirectDropDown
          items={Object.values(indies[data.indyId].savedTakes).map(
            (data) => data.combo
          )}
          value={data.combo}
          setValue={(combo) => updateTakeCombo(combo, data)}
        />
      </div>
      <div className="takes-group__module__item__btn__group">
        <div
          onClick={() => lockValueFromGenerating(data.id)}
          className={`btn btn--item btn--item--gray `}
        >
          L
        </div>

        <div onClick={() => saveCombo(data)} className="btn btn--item">
          S
        </div>

        <div
          onClick={() => generateComboFromSavedAction(data)}
          className="btn btn--item"
        >
          GS
        </div>

        <div
          onClick={() => generateComboFromIndyAction(data)}
          className="btn btn--item"
        >
          GL
        </div>
      </div>
      <Handle />
    </div>
  )
)

const SortableContainer = sortableContainer(
  ({
    items,
    activeIndyVariation,
    containerRef,
    generateComboFromSavedAction,
    lockValueFromGenerating,
    saveCombo,
    indies,
    updateTakeCombo,
    ////////////////////////
    generateComboFromIndyAction,
  }) => {
    return (
      <div ref={containerRef} className="takes-group__module__body">
        {Object.values(items).map((data, index) => (
          <SortableItem
            key={data.id}
            index={index}
            data={data}
            activeIndyVariation={activeIndyVariation}
            generateComboFromSavedAction={generateComboFromSavedAction}
            lockValueFromGenerating={lockValueFromGenerating}
            saveCombo={saveCombo}
            indies={indies}
            updateTakeCombo={updateTakeCombo}
            ///////////////////////////
            generateComboFromIndyAction={generateComboFromIndyAction}
          />
        ))}
      </div>
    )
  }
)

const MasterViewTakesGroup = ({
  activeUniVariation,
  activeMasterSession,
  activeIndyVariation,
  updateUnis,
  activeMasterViewVariation,
  indies,
  homeFolderPath,
}) => {
  const containerRef = useRef(null)

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      let orderedItems = {}
      arrayMoveImmutable(
        Object.entries(activeMasterViewVariation.takes),
        oldIndex,
        newIndex
      ).map(([id, item]) => {
        orderedItems[id] = item
      })

      updateUnis('update-master-session', {
        masterView: {
          ...activeMasterSession.masterView,
          [activeMasterSession.activeMasterViewVariation.id]: {
            ...activeMasterViewVariation,
            takes: orderedItems,
          },
        },
      })
    }
  }

  const generateComboFromSavedAction = (savedMasterTake) => {
    const newSavedTake = generateComboFromSaved(
      activeMasterSession.savedCombos[savedMasterTake.indy],
      savedMasterTake
    )

    updateUnis('update-master-session', {
      masterView: {
        ...activeMasterSession.masterView,
        [activeMasterSession.activeMasterViewVariation.id]: {
          ...activeMasterViewVariation,
          takes: {
            ...activeMasterViewVariation.takes,
            [savedMasterTake.id]: newSavedTake,
          },
        },
      },
    })
  }

  const generateComboFromIndyAction = (savedMasterTake) => {
    let comboList = []
    Object.values(indies[savedMasterTake.indyId].savedTakes).map(({ combo }) =>
      comboList.push(combo)
    )
    const newSavedTake = generateComboFromSaved(comboList, savedMasterTake)

    updateUnis('update-master-session', {
      masterView: {
        ...activeMasterSession.masterView,
        [activeMasterSession.activeMasterViewVariation.id]: {
          ...activeMasterViewVariation,
          takes: {
            ...activeMasterViewVariation.takes,
            [savedMasterTake.id]: newSavedTake,
          },
        },
      },
    })
  }

  const generateComboFromSavedAllForIndiesAction = () => {
    const newSavedTakes = generateComboFromSavedAllForIndies(
      activeMasterSession.savedCombos,
      activeMasterViewVariation.takes
    )

    updateUnis('update-master-session', {
      masterView: {
        ...activeMasterSession.masterView,
        [activeMasterSession.activeMasterViewVariation.id]: {
          ...activeMasterViewVariation,
          takes: newSavedTakes,
        },
      },
    })
  }

  const generateComboFromAddedTakesAllForIndiesAction = () => {
    let activeMasterViewVariation =
      activeMasterSession.masterView[
        activeMasterSession.activeMasterViewVariation.id
      ]
    const newSavedTakes = generateComboFromAddedTakesAllForIndies(
      indies,
      activeMasterViewVariation.takes
    )
    updateUnis('update-master-session', {
      masterView: {
        ...activeMasterSession.masterView,
        [activeMasterSession.activeMasterViewVariation.id]: {
          ...activeMasterViewVariation,
          takes: newSavedTakes,
        },
      },
    })
  }

  const saveCombo = ({ indy, combo }) => {
    if (activeMasterSession['savedCombos'][indy]) {
      if (!activeMasterSession['savedCombos'][indy].includes(combo)) {
        window.notify('Saving ...')

        ipcRenderer.send('save-combo', {
          readPath: activeMasterSession.path,
          combo,
          title: indy,
          homeFolderPath,
          masterId: activeMasterSession.id,
          variationId: activeUniVariation.id,
        })
      } else {
        window.notify('Already Saved')
      }
    } else {
      window.notify('No corresponding saved combos column')
    }
  }

  const lockValueFromGenerating = (id) => {
    let activeMasterViewVariation =
      activeMasterSession.masterView[
        activeMasterSession.activeMasterViewVariation.id
      ]
    updateUnis('update-master-session', {
      masterView: {
        ...activeMasterSession.masterView,
        [activeMasterSession.activeMasterViewVariation.id]: {
          ...activeMasterViewVariation,
          takes: {
            ...activeMasterViewVariation.takes,
            [id]: {
              ...activeMasterViewVariation.takes[id],
              isLocked: !activeMasterViewVariation.takes[id].isLocked,
            },
          },
        },
      },
    })
  }

  const unLockAll = () => {
    let activeMasterViewVariation =
      activeMasterSession.masterView[
        activeMasterSession.activeMasterViewVariation.id
      ]

    Object.keys(activeMasterViewVariation.takes).map((key) => {
      activeMasterViewVariation.takes[key].isLocked = false
    })

    updateUnis('update-master-session', {
      masterView: {
        ...activeMasterSession.masterView,
        [activeMasterSession.activeMasterViewVariation.id]: {
          ...activeMasterViewVariation,
          takes: activeMasterViewVariation.takes,
        },
      },
    })
  }

  const updateTakeCombo = (combo, savedTake) => {
    if (combo !== savedTake.combo)
      updateUnis('update-master-session', {
        masterView: {
          ...activeMasterSession.masterView,
          [activeMasterSession.activeMasterViewVariation.id]: {
            ...activeMasterViewVariation,
            takes: {
              ...activeMasterViewVariation.takes,
              [savedTake.id]: {
                ...activeMasterViewVariation.takes[savedTake.id],
                combo,
              },
            },
          },
        },
      })
  }

  useEffect(() => {
    let tbody = containerRef.current
    let hasVerticalScrollbar = tbody.scrollHeight > tbody.clientHeight

    if (hasVerticalScrollbar) {
      tbody.classList.add('takes-group__module__body--scroll')
    } else {
      tbody.classList.remove('takes-group__module__body--scroll')
    }

    const resizeId = window.addEventListener('resize', () => {
      let hasVerticalScrollbar = tbody.scrollHeight > tbody.clientHeight

      if (hasVerticalScrollbar) {
        tbody.classList.add('takes-group__module__body--scroll')
      } else {
        tbody.classList.remove('takes-group__module__body--scroll')
      }
    })

    return () => window.removeEventListener('resize', resizeId)
  }, [])

  useEffect(() => {
    let tbody = containerRef.current
    let hasVerticalScrollbar = tbody.scrollHeight > tbody.clientHeight

    if (hasVerticalScrollbar) {
      tbody.classList.add('takes-group__module__body--scroll')
    } else {
      tbody.classList.remove('takes-group__module__body--scroll')
    }
  }, [activeMasterViewVariation.takes])

  return (
    <div className="takes-group__module takes-group__module--masterview">
      <div className="source-group__module__group">
        <div
          onClick={unLockAll}
          className={`btn btn--master ${
            isObjectEmpty(activeIndyVariation.savedTakes) ? 'disable' : ''
          }`}
        >
          Unlock All
        </div>

        <div
          onClick={generateComboFromAddedTakesAllForIndiesAction}
          className={`btn btn--all ${
            isObjectEmpty(activeIndyVariation.savedTakes) ? 'disable' : ''
          }`}
        >
          Generate All From Indy
        </div>

        <div
          onClick={generateComboFromSavedAllForIndiesAction}
          className={`btn btn--all ${
            isObjectEmpty(activeIndyVariation.savedTakes) ? 'disable' : ''
          }`}
        >
          Generate All From SC
        </div>
      </div>

      <SortableContainer
        onSortEnd={onSortEnd}
        lockToContainerEdges={true}
        lockOffset="20%"
        lockAxis="y"
        axis="y"
        distance={1}
        items={activeMasterViewVariation.takes}
        containerRef={containerRef}
        useDragHandle
        activeIndyVariation={activeIndyVariation}
        generateComboFromSavedAction={generateComboFromSavedAction}
        generateComboFromIndyAction={generateComboFromIndyAction}
        lockValueFromGenerating={lockValueFromGenerating}
        saveCombo={saveCombo}
        indies={indies}
        updateTakeCombo={updateTakeCombo}
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  let { activeUniVariation, activeMasterSession, activeIndyVariation } =
    getActives(state)

  return {
    activeUniVariation,
    activeIndyVariation: activeMasterSession ? activeIndyVariation : {},
    activeMasterSession,
    indies: activeMasterSession
      ? activeMasterSession.masterView[
          activeMasterSession.activeMasterViewVariation.id
        ].indies
      : {},

    activeMasterViewVariation: activeMasterSession
      ? activeMasterSession.masterView[
          activeMasterSession.activeMasterViewVariation.id
        ]
      : {},
  }
}

export default connect(mapStateToProps)(MasterViewTakesGroup)
