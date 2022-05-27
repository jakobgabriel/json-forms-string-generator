import React, { useState, useEffect, useRef } from "react"
import { sortableContainer, sortableElement } from "react-sortable-hoc"
import { arrayMoveImmutable } from "array-move"
import { connect } from "react-redux"

import { getActives } from "../../Funtions"
import OptionsMenu from "../main/OptionsMenu"
import ConfirmModal from "../modals/ConfirmModal"

const SortableItem = sortableElement(({ item, itemClick, activeNote, updateItem, setMenu }) => {
  const [cValue, setCvalue] = useState(item.title)
  const [isEditing, setIsEditing] = useState(false)
  const itemRef = useRef(null)

  let removal = null
  useEffect(() => {
    if (isEditing) {
      let input = itemRef.current.children[0]
      let span = itemRef.current.children[1]
      var stopEdit = () => {
        input.style.display = "none"
        span.style.display = "initial"
        document.body.removeEventListener("click", stopEdit)
        setIsEditing(false)
        if (cValue !== item.title) updateItem(cValue, item.id)
      }
      removal = stopEdit
      document.body.addEventListener("click", stopEdit)
    }

    return () => document.body.removeEventListener("click", stopEdit)
  }, [cValue, isEditing])

  return (
    <div
      ref={itemRef}
      onClick={(e) => {
        e.stopPropagation()
        if (activeNote.id !== item.id) itemClick(item)
      }}
      onDoubleClick={(e) => {
        let input = e.currentTarget.children[0]
        let span = e.currentTarget.children[1]

        setCvalue(item.title)

        input.style.display = "initial"
        span.style.display = "none"

        setIsEditing(true)
      }}
      onAuxClick={(e) => setMenu({ x: e.pageX, y: e.pageY, isOpen: true, id: item.id })}
      className={`notes__nav__item ${activeNote.id === item.id ? `notes__nav__item--active` : ""}`}
      style={{
        background: activeNote.id === item.id ? "#698cab" : "#d5d6e1",
        color: activeNote.id === item.id ? "#fff" : "#53585f",
      }}
    >
      <input
        style={{ display: "none" }}
        id={item.id}
        className="hidden-input"
        value={cValue}
        onChange={(e) => setCvalue(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.style.display = "none"
            e.currentTarget.nextSibling.style.display = "initial"
            if (cValue !== item.title) updateItem(cValue, item.id)
            document.body.removeEventListener("click", removal)
          }
        }}
      ></input>
      <span>{item.title}</span>
    </div>
  )
})

const SortableContainer = sortableContainer(
  ({ items, containerRef, itemClick, activeNote, updateItem, newNote, setMenu }) => {
    return (
      <div ref={containerRef} className="horizontal-list-body">
        {Object.entries(items).map(([id, item], index) =>
          !item.isCoreVariation ? (
            <SortableItem
              key={index}
              index={index}
              item={item}
              itemClick={itemClick}
              activeNote={activeNote}
              updateItem={updateItem}
              setMenu={setMenu}
            />
          ) : (
            (() => {
              const [cValue, setCvalue] = useState(item.title)
              const [isEditing, setIsEditing] = useState(false)
              const itemRef = useRef(null)

              let removal = null

              useEffect(() => {
                if (isEditing) {
                  let input = itemRef.current.children[0]
                  let span = itemRef.current.children[1]
                  var stopEdit = () => {
                    input.style.display = "none"
                    span.style.display = "initial"
                    document.body.removeEventListener("click", stopEdit)
                    setIsEditing(false)
                    if (cValue !== item.title) updateItem(cValue, item.id)
                  }
                  removal = stopEdit
                  document.body.addEventListener("click", stopEdit)
                }

                return () => document.body.removeEventListener("click", stopEdit)
              }, [cValue, isEditing])

              return (
                <div
                  key={index}
                  ref={itemRef}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (activeNote.id !== item.id) itemClick(item)
                  }}
                  onDoubleClick={(e) => {
                    let input = e.currentTarget.children[0]
                    let span = e.currentTarget.children[1]

                    input.style.display = "initial"
                    span.style.display = "none"
                    setIsEditing(true)
                  }}
                  className={`notes__nav__item ${
                    activeNote.id === item.id ? `notes__nav__item--active` : ""
                  }`}
                >
                  <input
                    style={{ display: "none" }}
                    id={item.id}
                    className="hidden-input"
                    value={cValue}
                    onChange={(e) => setCvalue(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        e.currentTarget.style.display = "none"
                        e.currentTarget.nextSibling.style.display = "initial"
                        if (cValue !== item.title) updateItem(cValue, item.id)
                        document.body.removeEventListener("click", removal)
                      }
                    }}
                  ></input>
                  <span>{item.title}</span>
                </div>
              )
            })()
          )
        )}

        <svg onClick={newNote} className="notes__nav__icon">
          <use xlinkHref="./svg/add.svg#add"></use>
        </svg>
      </div>
    )
  }
)

const NotesNav = ({ updateUnis, activeMasterSession, notes, activeNote }) => {
  const containerRef = useRef(null)
  const [menu, setMenu] = useState({ isOpen: false })

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    setIsOpen: (value) => setConfirmModal({ ...confirmModal, open: value }),
    title: "",
    message: "",
    icon: "",
    isOpen: false,
    btns: [],
  })

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      let orderedItems = {}
      arrayMoveImmutable(Object.entries(notes), oldIndex, newIndex).map(([id, item]) => {
        orderedItems[id] = item
      })
      updateUnis("update-notes-list", orderedItems)
    }
    containerRef.current.classList.remove("sorting")
  }

  const itemClick = (data) => updateUnis("set-active-note", { id: data.id })

  const updateItem = (data, id) =>
    updateUnis("update-master-session", {
      notes: {
        ...activeMasterSession.notes,
        [id]: { ...activeMasterSession.notes[id], title: data },
      },
    })

  const newNote = () => {
    let id = crypto.randomUUID()
    updateUnis("update-master-session", {
      notes: {
        ...activeMasterSession.notes,
        [id]: {
          note: "",
          id,
          title: "New Note",
          isCoreVariation: false,
        },
      },

      activeNote: { id },
    })
  }

  return (
    <div className="notes__nav">
      <SortableContainer
        onSortEnd={onSortEnd}
        onSortStart= {()=> containerRef.current.classList.add("sorting")}
        lockToContainerEdges={true}
        lockOffset="11%"
        lockAxis="x"
        axis="x"
        distance={1}
        items={notes}
        itemClick={itemClick}
        containerRef={containerRef}
        activeNote={activeNote}
        updateItem={updateItem}
        newNote={newNote}
        setMenu={setMenu}
      />

      <OptionsMenu
        menu={menu}
        setMenu={setMenu}
        options={[
          {
            title: "Delete Note",
            action: (menu, setMenu) => {
              setMenu({ isOpen: false })

              setConfirmModal({
                ...confirmModal,
                title: "Delete A Note",
                message: "Are you sure you want to delete this note ?",
                isOpen: true,
                btns: [
                  {
                    name: "Yes",
                    action: () => updateUnis("delete-note-variation", null, menu.id),
                  },
                  {
                    name: "No",
                    action: () => {},
                  },
                ],
              })
            },
          },
        ]}
      />

      <ConfirmModal {...confirmModal} />
    </div>
  )
}

const mapStateToProps = (state) => {
  let { activeMasterSession, activeIndy } = getActives(state)

  return {
    activeMasterSession: activeMasterSession ? activeMasterSession : {},
    notes: activeMasterSession ? activeMasterSession.notes : {},
    activeNote: activeMasterSession ? activeMasterSession.activeNote : {},
  }
}

export default connect(mapStateToProps)(NotesNav)
