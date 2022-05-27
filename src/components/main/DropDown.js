import React, { useState, useEffect, useRef } from "react"

import {
  Menu,
  MenuItem,
  // SubMenu
} from "@szhsin/react-menu"
import "@szhsin/react-menu/dist/index.css"
import "@szhsin/react-menu/dist/transitions/slide.css"

import { isObjectEmpty } from "../../Funtions"

const DropDown = ({
  items,
  value,
  setValue,
  placeholder,
  className,
  style,
  required,
  tabIndex,
  id,
}) => {
  const menuRef = useRef(null)
  const [selected, setSelected] = useState(null)

  const setSelectedItme = (title) => {
    setSelected({ name: title })
    setValue({ title })
    // if (returnName) setValue(item.name)
    // else if (returnAllStaff) setValue(item)
    // else setValue(item.value)
  }

  useEffect(() => {
    setSelected({ name: value })
  }, [value, items])

  return (
    <div
      ref={menuRef}
      className={`dropDown ${items ? (items.length === 0 ? "disable" : "") : ""} ${
        required ? (!selected ? "dropDown--invalid" : "") : ""
      } ${className} `}
      tabIndex={tabIndex ? tabIndex : 0}
      id={id}
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      <Menu
        menuButton={({ open }) => {
          return (
            <div className="dropDown__subgroub">
              <div className="dropDown__title">
                {selected ? (
                  selected.name !== "" && !!selected.name ? (
                    <>{selected.name}</>
                  ) : (
                    <div className="dropDown__placeholder">{placeholder}</div>
                  )
                ) : (
                  <div className="dropDown__placeholder">{placeholder}</div>
                )}
              </div>
              {required && !selected ? (
                <input
                  style={{ width: 0, height: 0, visibility: "hidden" }}
                  onInvalid={(e) => e.preventDefault()}
                  required
                ></input>
              ) : null}

              <div className="dropDown__icon__group">
                <svg
                  style={{ transform: open ? "rotateX(180deg)" : "rotateX(0deg)" }}
                  className={`dropDown__icon ${
                    items ? (items.length === 0 ? "displayNone" : "") : ""
                  }`}
                >
                  <use xlinkHref="./svg/triangle.svg#triangle"></use>
                </svg>
              </div>
            </div>
          )
        }}
      >
        {items
          ? items.map((item, id) => (
              <MenuItem
                onClick={() => setSelectedItme(item.title)}
                key={id}
                className="header__item"
                disabled={item.disabled}
              >
                {item.title}
              </MenuItem>
            ))
          : null}
      </Menu>
    </div>
  )
}

export default DropDown
