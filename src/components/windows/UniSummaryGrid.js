import React, { useRef } from "react"
import { sortableContainer, sortableElement } from "react-sortable-hoc"
import { arrayMoveImmutable } from "array-move"

import DropDown from "../main/DropDown"

const SortableItem = sortableElement(
  ({ item, activeMasterSession, itemClick, chnageTakeSource }) => {
    let activeMasterViewVariation = item.masterView[item.activeMasterViewVariation.id]

    let presentedTake =
      activeMasterViewVariation.takes[activeMasterViewVariation.presentedTake.title]

    return (
      <div
        onClick={() => itemClick(item)}
        className={`uni-summary__node ${
          activeMasterSession.id === item.id ? "uni-summary__node--active" : ""
        }`}
      >
        {item.title}

        <div className="uni-summary__node__value">
          {presentedTake ? presentedTake.combo : "Empty"}
        </div>

        <DropDown
          value={activeMasterViewVariation.presentedTake.title}
          items={Object.values(activeMasterViewVariation.indies)}
          setValue={(value) => chnageTakeSource(value, item.id)}
        />
      </div>
    )
  }
)

const SortableContainer = sortableContainer(
  ({ items, containerRef, itemClick, updateItem, activeMasterSession, chnageTakeSource }) => {
    return (
      <div ref={containerRef} className="uni-summary__grid__body">
        {Object.entries(items).map(([id, item], index) => (
          <SortableItem
            key={index}
            index={index}
            item={item}
            itemClick={itemClick}
            updateItem={updateItem}
            disabled={item.id === "v0" ? true : false}
            activeMasterSession={activeMasterSession}
            chnageTakeSource={chnageTakeSource}
          />
        ))}
      </div>
    )
  }
)

const UniSummaryGrid = ({
  unis,
  ////////////////
  updateUnis,
  activeMasterSession,
  activeUniVariation,
}) => {
  const containerRef = useRef(null)

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      let orderedItems = {}
      arrayMoveImmutable(Object.entries(activeUniVariation.masterSessions), oldIndex, newIndex).map(
        ([id, item]) => {
          orderedItems[id] = item
        }
      )
      containerRef.current.classList.remove("sorting")
      updateUnis("update-master-session-list", orderedItems)
    }
  }

  const itemClick = (data) => updateUnis("set-active-masterSession-masterView", { id: data.id })

  const chnageTakeSource = (presentedTake, id) => {
    updateUnis("update-active-masterView-of-targeted-masterSession", { presentedTake }, id)
  }

  const updateItem = (data, id) =>
    updateUnis("update-uni-session", {
      variations: {
        ...unis.variations,
        [id]: { ...unis.variations[id], title: data },
      },
    })

  return (
    <div className="uni-summary__grid">
      <SortableContainer
        onSortEnd={onSortEnd}
        onSortStart= {()=> containerRef.current.classList.add("sorting")}
        lockToContainerEdges={true}
        lockOffset="11%"
        lockAxis="xy"
        axis="xy"
        distance={1}
        items={activeUniVariation.masterSessions}
        itemClick={itemClick}
        containerRef={containerRef}
        updateItem={updateItem}
        activeMasterSession={activeMasterSession}
        chnageTakeSource={chnageTakeSource}
      />
    </div>
  )
}

export default UniSummaryGrid
