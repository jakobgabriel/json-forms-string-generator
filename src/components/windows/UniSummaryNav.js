import React, { useState, useEffect, useRef } from "react"
import { sortableContainer, sortableElement } from "react-sortable-hoc"
import { arrayMoveImmutable } from "array-move"

import OptionsMenu from "../main/OptionsMenu"
import ConfirmModal from "../modals/ConfirmModal"

const SortableItem = sortableElement(
  ({ item, itemClick, activeUniViewVariation, updateItem, setMenu }) => {
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
          itemClick(item)
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
        className={`masterview__nav__item ${
          activeUniViewVariation.id === item.id ? `masterview__nav__item--active` : ""
        }`}
        style={{
          background:
            activeUniViewVariation.id === item.id ? "rgb(104, 104, 104)" : "rgb(146, 146, 146)",
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
  }
)

const SortableContainer = sortableContainer(
  ({
    items,
    containerRef,
    itemClick,
    updateItem,
    newUniSessionVariation,
    activeUniViewVariation,
    setMenu,
  }) => {
    return (
      <div ref={containerRef} className="horizontal-list-body">
        {Object.entries(items).map(([id, item], index) =>
          !item.isCoreVariation ? (
            <SortableItem
              key={index}
              index={index}
              item={item}
              itemClick={itemClick}
              updateItem={updateItem}
              activeUniViewVariation={activeUniViewVariation}
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
                    itemClick(item)
                  }}
                  onDoubleClick={(e) => {
                    let input = e.currentTarget.children[0]
                    let span = e.currentTarget.children[1]

                    input.style.display = "initial"
                    span.style.display = "none"

                    setIsEditing(true)
                  }}
                  className={`masterview__nav__item ${
                    activeUniViewVariation.id === item.id ? `masterview__nav__item--active` : ""
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
        <svg onClick={newUniSessionVariation} className="masterview__nav__icon">
          <use xlinkHref="./svg/add.svg#add"></use>
        </svg>
      </div>
    )
  }
)

const UniSummaryNav = ({ unis, updateUnis }) => {
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
      arrayMoveImmutable(Object.entries(unis.variations), oldIndex, newIndex).map(([id, item]) => {
        orderedItems[id] = item
      })
      updateUnis("update-uni-session-variation-list", orderedItems)
    }

    containerRef.current.classList.remove("sorting")

  }

  const itemClick = (data) => updateUnis("set-active-uni-session-variation", { id: data.id })

  const updateItem = (data, id) =>
    updateUnis("update-uni-session", {
      variations: {
        ...unis.variations,
        [id]: { ...unis.variations[id], title: data },
      },
    })

  const newUniSessionVariation = () => {
    let id = crypto.randomUUID()

    updateUnis(
      "add-uni-variation",
      {
        id,
        title: "New Variation",
        isCoreVariation: false,
      },
      id
    )
  }

  return (
    <div className="masterview__nav">
      <SortableContainer
        onSortEnd={onSortEnd}
        onSortStart= {()=> containerRef.current.classList.add("sorting")}
        lockToContainerEdges={true}
        lockOffset="11%"
        lockAxis="x"
        axis="x"
        distance={1}
        items={unis.variations ? unis.variations : {}}
        itemClick={itemClick}
        containerRef={containerRef}
        activeUniViewVariation={unis.activeUniViewVariation}
        updateItem={updateItem}
        newUniSessionVariation={newUniSessionVariation}
        setMenu={setMenu}
      />

      <OptionsMenu
        menu={menu}
        setMenu={setMenu}
        options={[
          {
            title: "Delete Variation",
            action: (menu, setMenu) => {
              setMenu({ isOpen: false })

              setConfirmModal({
                ...confirmModal,
                title: "Delete A Uni Variation",
                message: "Are you sure you want to delete this uni variation?",
                isOpen: true,
                btns: [
                  {
                    name: "Yes",
                    action: () => updateUnis("delete-uni-variation", null, menu.id),
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

export default UniSummaryNav
