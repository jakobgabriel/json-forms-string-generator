import React, { useState, useEffect, useRef } from "react"

import {
  Menu,
  MenuItem,
  // SubMenu
} from "@szhsin/react-menu"
import "@szhsin/react-menu/dist/index.css"
import "@szhsin/react-menu/dist/transitions/slide.css"

import { isObjectEmpty } from "../../Funtions"

const DirectDropDown = ({ items, value, setValue, className, style, tabIndex, id }) => {
  const menuRef = useRef(null)
  // const [selected, setSelected] = useState(null)

  // const setSelectedItme = (item) => {
  //   setSelected(item)
  //   if (returnName) setValue(item.name)
  //   else if (returnAllStaff) setValue(item)
  //   else setValue(item.value)
  // }
  // useEffect(() => {
  //   if (!isObjectEmpty(value) && value && !selected) {
  //     if (typeof value === "object" && value !== null && !Array.isArray(value)) {
  //       if (isCustom) setSelected({ name: value[customProperty], value })
  //       else {
  //         setSelected({ name: value.title, value })
  //       }
  //     } else {
  //       setSelected({ name: value })
  //     }
  //   }

  //   if (value.name === "") {
  //     setSelected(null)
  //   }
  // }, [value, items])

  return (
    <div
      ref={menuRef}
      className={`DirectDropDown ${
        items ? (items.length === 0 ? "disable" : "") : ""
      }  ${className} `}
      tabIndex={tabIndex ? tabIndex : 0}
      id={id}
      style={style}
    >
      <Menu
        offsetX={-20}
        offsetY={7}
        // align={"start"}
        // direction={"left"}
        menuButton={({ open }) => {
          return (
            <div style={{ display: "flex", justifyContent: "end" }}>
              <svg
                style={{ transform: open ? "rotateX(180deg)" : "rotateX(0deg)" }}
                className={`DirectDropDown__icon ${
                  items ? (items.length === 0 ? "displayNone" : "") : ""
                }`}
              >
                <use xlinkHref="./svg/triangle.svg#triangle"></use>
              </svg>
            </div>
          )
        }}
      >
        {items
          ? items.map((item, id) => (
              <MenuItem
                onClick={() => setValue(item)}
                key={id}
                className="header__item"
                disabled={item.disabled}
              >
                {item}
              </MenuItem>
            ))
          : null}
      </Menu>
    </div>
  )
}

export default DirectDropDown
