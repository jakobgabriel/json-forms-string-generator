import React, { useState, useEffect, useRef } from "react"
import { sortableContainer, sortableElement } from "react-sortable-hoc"
import { arrayMoveImmutable } from "array-move"

const SortableItem = sortableElement(
  ({ item, itemClick, activeMasterSession, updateItem, setMenu }) => {
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
          if (cValue !== item.title) updateItem({ title: cValue }, item.id)
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
          if (activeMasterSession.id !== item.id) itemClick(item)
        }}

        onDoubleClick={(e) => {
          let input = e.currentTarget.children[0]
          let span = e.currentTarget.children[1]
          setCvalue(item.title)
          input.style.display = "initial"
          span.style.display = "none"
          setIsEditing(true)
        }}

        onAuxClick={(e) =>
          item.variation !== 0
            ? setMenu({ x: e.pageX, y: e.pageY, isOpen: true, id: item.id })
            : null
        }

        className={`main-panel__item  ${
          activeMasterSession.id === item.id ? `main-panel__item--active` : ""
        }`}

        style={{
          background:
            activeMasterSession.id === item.id ? "rgb(104, 104, 104)" : "rgb(146, 146, 146)",
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
              if (cValue !== item.title) updateItem({ title: cValue }, item.id)
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
  ({ items, containerRef, itemClass, itemClick, activeMasterSession, updateItem, setMenu }) => {
    return (
      <div ref={containerRef} className="vertical-list-body">
        {Object.entries(items).map(([id, item], index) => (
          <SortableItem
            key={index}
            index={index}
            item={item}
            itemClick={itemClick}
            activeMasterSession={activeMasterSession}
            updateItem={updateItem}
            setMenu={setMenu}
          />
        ))}
      </div>
    )
  }
)

const MasterSessionsNav = ({
  items,
  axis,
  updateList,
  updateItem,
  itemClick,
  activeMasterSession,
  setMenu,
}) => {
  const containerRef = useRef(null)

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      let orderedItems = {}

      arrayMoveImmutable(Object.entries(items), oldIndex, newIndex).map(([id, item]) => {
        orderedItems[id] = item
      })

      updateList(orderedItems)
    }

    containerRef.current.classList.remove("sorting")
  }

  useEffect(() => {
    let tbody = containerRef.current
    let hasVerticalScrollbar = tbody.scrollHeight > tbody.clientHeight

    if (hasVerticalScrollbar) {
      tbody.classList.add("vertical-list-body--scroll")
    } else {
      tbody.classList.remove("vertical-list-body--scroll")
    }

    const resizeId = window.addEventListener("resize", () => {
      let hasVerticalScrollbar = tbody.scrollHeight > tbody.clientHeight

      if (hasVerticalScrollbar) {
        tbody.classList.add("vertical-list-body--scroll")
      } else {
        tbody.classList.remove("vertical-list-body--scroll")
      }
    })

    return () => window.removeEventListener("resize", resizeId)
  }, [])

  useEffect(() => {
    let tbody = containerRef.current
    let hasVerticalScrollbar = tbody.scrollHeight > tbody.clientHeight

    if (hasVerticalScrollbar) {
      tbody.classList.add("vertical-list-body--scroll")
    } else {
      tbody.classList.remove("vertical-list-body--scroll")
    }
  }, [items])

  return (
    <SortableContainer
      onSortEnd={onSortEnd}
      onSortStart= {()=> containerRef.current.classList.add("sorting")}
      lockToContainerEdges={true}
      lockOffset="20%"
      lockAxis={axis}
      axis={axis}
      distance={1}
      items={items}
      itemClick={itemClick}
      containerRef={containerRef}
      activeMasterSession={activeMasterSession}
      updateItem={updateItem}
      setMenu={setMenu}
    />
  )
}

export default MasterSessionsNav
