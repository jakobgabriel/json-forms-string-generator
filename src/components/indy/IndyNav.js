import React, { useState, useEffect, useRef } from "react"
import { sortableContainer, sortableElement } from "react-sortable-hoc"
import { arrayMoveImmutable } from "array-move"
import { connect } from "react-redux"

import { updateUnis } from "../../actions"
import { getActives } from "../../Funtions"

const SortableItem = sortableElement(({ item, itemClick, activeIndy }) => (
  <div
    onClick={(e) => {
      e.stopPropagation()

      if (activeIndy.id !== item.id) itemClick(item)
    }}
    className={`indy-station__nav__item ${
      activeIndy.id === item.id ? `indy-station__nav__item--active` : ""
    }`}
    style={{
      background: activeIndy.id === item.id ? "#698cab" : "#d5d6e1",
      color: activeIndy.id === item.id ? "#fff" : "#53585f",
    }}
  >
    <span>{item.title}</span>
  </div>
))

const SortableContainer = sortableContainer(({ items, containerRef, itemClick, activeIndy }) => {
  return (
    <div ref={containerRef} className="horizontal-list-body">
      <div
        onClick={() => {
          if (activeIndy.type !== "NOTES") itemClick({ type: "NOTES" })
        }}
        className={`indy-station__nav__item ${
          activeIndy.type === "NOTES" ? `indy-station__nav__item--active` : ""
        }`}
      >
        NOTES
      </div>
      <div
        onClick={() => {
          if (activeIndy.type !== "VIEW") itemClick({ type: "VIEW" })
        }}
        className={`indy-station__nav__item ${
          activeIndy.type === "VIEW" ? `indy-station__nav__item--active` : ""
        }`}
      >
        MASTER VIEW
      </div>

      {Object.entries(items).map(([id, item], index) => (
        <SortableItem
          key={index}
          index={index}
          item={item}
          itemClick={itemClick}
          activeIndy={activeIndy}
        />
      ))}
    </div>
  )
})

const IndyNav = ({
  updateUnis,
  indies,
  activeIndy,
  // updateList,
  // updateItem,
  // itemClick,
  // setMenu,
}) => {
  const containerRef = useRef(null)

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      let orderedItems = {}

      arrayMoveImmutable(Object.entries(indies), oldIndex, newIndex).map(([id, item]) => {
        orderedItems[id] = item
      })
      updateUnis("update-indy-list", orderedItems)
    }
    containerRef.current.classList.remove("sorting")
  }

  const itemClick = (data, id) =>
    updateUnis("set-active-indy", { id: data.id, type: data.type }, id)

  return (
    <div className="master__nav">
      <SortableContainer
        onSortEnd={onSortEnd}
        onSortStart= {()=> containerRef.current.classList.add("sorting")}
        lockToContainerEdges={true}
        lockOffset="11%"
        lockAxis="x"
        axis="x"
        distance={1}
        items={indies}
        itemClick={itemClick}
        containerRef={containerRef}
        activeIndy={activeIndy}
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  let { activeMasterSession, activeIndy } = getActives(state)

  return {
    activeIndy: activeMasterSession ? activeIndy : {},
    indies: activeMasterSession ? activeMasterSession.indies : {},
  }
}

const mapDispatchToProps = { updateUnis }

export default connect(mapStateToProps, mapDispatchToProps)(IndyNav)
