import React, { useState, useEffect, useRef } from 'react'
import {
  sortableContainer,
  sortableElement,
  SortableHandle,
} from 'react-sortable-hoc'
import { arrayMoveImmutable } from 'array-move'

import { ipcRenderer } from 'electron'
import {
  isObjectEmpty,
  generateComboFromSaved,
  generateComboFromSavedAll,
} from '../../Funtions'

import DirectDropDown from '../main/DirectDropDown'
import ConfirmModal from '../modals/ConfirmModal'

const Handle = SortableHandle(() => (
  <svg className="takes-group__module__item__handle">
    <use xlinkHref="./svg/draggabledots.svg#draggabledots"></use>
  </svg>
))

const SortableItem = sortableElement(
  ({
    data,
    activeIndyVariation,
    savedCobos,
    generateComboFromSavedAction,
    lockValueFromGenerating,
    saveCombo,
    updateTakeCombo,
    deleteTake,
  }) => (
    <div className="takes-group__module__item">
      <svg
        onClick={() => deleteTake(data.id)}
        className="takes-group__module__item__delete"
      >
        <use xlinkHref="./svg/delete-alt.svg#delete-alt"></use>
      </svg>

      <div
        className={`takes-group__module__item__combo ${
          data.isLocked ? 'togray' : ''
        }`}
      >
        {data.combo}

        <DirectDropDown
          items={savedCobos}
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
        <div onClick={() => saveCombo(data.id)} className="btn btn--item">
          S
        </div>

        <div
          onClick={() => generateComboFromSavedAction(data)}
          className="btn btn--item"
        >
          GS
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
    savedCobos,
    updateTakeCombo,
    deleteTake,
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
            savedCobos={savedCobos}
            updateTakeCombo={updateTakeCombo}
            deleteTake={deleteTake}
          />
        ))}
      </div>
    )
  }
)

const TakesGroupModule = ({
  activeMasterSession,
  activeIndyVariation,
  updateUnis,
  homeFolderPath,
}) => {
  const containerRef = useRef(null)

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    setIsOpen: (value) => setConfirmModal({ ...confirmModal, open: value }),
    title: '',
    message: '',
    icon: '',
    isOpen: false,
    btns: [],
  })

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      let orderedItems = {}
      arrayMoveImmutable(
        Object.entries(activeIndyVariation.savedTakes),
        oldIndex,
        newIndex
      ).map(([id, item]) => {
        orderedItems[id] = item
      })

      updateUnis(
        'update-indy',
        {
          savedTakes: { ...orderedItems },
        },
        activeIndyVariation.id
      )
    }
  }

  const generateComboFromSavedAction = (savedTake) => {
    const newSavedTake = generateComboFromSaved(
      activeMasterSession.savedCombos[activeIndyVariation.title],
      savedTake
    )

    updateUnis(
      'update-indy',
      {
        savedTakes: {
          ...activeIndyVariation.savedTakes,
          [savedTake.id]: newSavedTake,
        },
      },
      activeIndyVariation.id
    )
  }

  const generateComboFromSavedAllAction = () => {
    const newSavedTakes = generateComboFromSavedAll(
      activeMasterSession.savedCombos[activeIndyVariation.title],
      activeIndyVariation.savedTakes
    )

    updateUnis(
      'update-indy',
      {
        savedTakes: newSavedTakes,
      },
      activeIndyVariation.id
    )
  }

  const saveCombo = (id) => {
    if (activeMasterSession['savedCombos'][activeIndyVariation.title]) {
      let combo = activeIndyVariation.savedTakes[id].combo
      if (
        !activeMasterSession['savedCombos'][activeIndyVariation.title].includes(
          combo
        )
      ) {
        window.notify('Saving ...')
        ipcRenderer.send('save-combo', {
          readPath: activeMasterSession.path,
          combo,
          title: activeIndyVariation.title,
          homeFolderPath,
          masterId: activeMasterSession.id,
          stateUpdate: {
            savedCombos: {
              ...activeMasterSession['savedCombos'],
              [activeIndyVariation.title]: [
                ...activeMasterSession['savedCombos'][
                  activeIndyVariation.title
                ],
                combo,
              ],
            },
          },
        })
      } else {
        window.notify('Already Saved')
      }
    } else {
      window.notify('No corresponding saved combos column')
    }
  }

  const lockValueFromGenerating = (id) => {
    updateUnis(
      'update-indy',
      {
        savedTakes: {
          ...activeIndyVariation.savedTakes,
          [id]: {
            ...activeIndyVariation.savedTakes[id],
            isLocked: !activeIndyVariation.savedTakes[id].isLocked,
          },
        },
      },
      activeIndyVariation.id
    )
  }

  const unLockAll = () => {
    let currentSavedTakes = { ...activeIndyVariation.savedTakes }
    Object.keys(currentSavedTakes).map((key) => {
      currentSavedTakes[key].isLocked = false
    })

    updateUnis(
      'update-indy',
      {
        savedTakes: currentSavedTakes,
      },
      activeIndyVariation.id
    )
  }

  const updateTakeCombo = (combo, savedTake) => {
    if (combo !== savedTake.combo)
      updateUnis(
        'update-indy',
        {
          savedTakes: {
            ...activeIndyVariation.savedTakes,
            [savedTake.id]: {
              ...activeIndyVariation.savedTakes[savedTake.id],
              combo,
            },
          },
        },
        activeIndyVariation.id
      )
  }

  const deleteTake = (takeId) => {
    setConfirmModal({
      ...confirmModal,
      title: 'Delete A Combo Take',
      message: 'Are you sure you want to delete this combo take ?',
      isOpen: true,
      btns: [
        {
          name: 'Yes',
          action: () => updateUnis('delete-indy-take', null, takeId),
        },
        {
          name: 'No',
          action: () => {},
        },
      ],
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
  }, [activeIndyVariation.savedTakes])

  useEffect(() => {
    const keyEventHandler = (e) => {
      if (
        e.key === '2' &&
        activeIndyVariation.isSourceAvailable &&
        !isObjectEmpty(activeIndyVariation.savedTakes)
      )
        generateComboFromSavedAllAction()
    }
    document.body.addEventListener('keyup', keyEventHandler)
    return () => document.body.removeEventListener('keyup', keyEventHandler)
  }, [activeIndyVariation])

  return (
    <div className="takes-group__module">
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
          onClick={generateComboFromSavedAllAction}
          className={`btn btn--all ${
            isObjectEmpty(activeIndyVariation.savedTakes) ? 'disable' : ''
          }`}
        >
          Generate All Takes
        </div>
      </div>

      <SortableContainer
        onSortEnd={onSortEnd}
        lockToContainerEdges={true}
        lockOffset="20%"
        lockAxis="y"
        axis="y"
        distance={1}
        items={activeIndyVariation.savedTakes}
        containerRef={containerRef}
        useDragHandle
        activeIndyVariation={activeIndyVariation}
        generateComboFromSavedAction={generateComboFromSavedAction}
        lockValueFromGenerating={lockValueFromGenerating}
        saveCombo={saveCombo}
        savedCobos={activeMasterSession.savedCombos[activeIndyVariation.title]}
        updateTakeCombo={updateTakeCombo}
        deleteTake={deleteTake}
      />

      <ConfirmModal {...confirmModal} />
    </div>
  )
}

export default TakesGroupModule
