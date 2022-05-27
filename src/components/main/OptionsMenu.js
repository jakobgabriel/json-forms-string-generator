import React, { useEffect } from "react"
import { connect } from "react-redux"

import { updateUnis } from "../../actions"

const OptionsMenu = ({ menu, setMenu, updateUnis, options }) => {
  const deleteSession = (menu, setMenu) => {
    updateUnis("delete-master-session", null, menu.id)
    setMenu({ isOpen: false })
  }

  useEffect(() => {
    if (menu.isOpen) {
      var close = () => {
        setMenu({ isOpen: false })
        document.body.removeEventListener("click", close)
      }
      document.body.addEventListener("click", close)
    }
    return () => document.body.removeEventListener("click", close)
  })

  return menu.isOpen ? (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ top: menu.y, left: menu.x }}
      className="context-menu"
    >
      {options.map(({ title, action }, index) => (
        <div key={index} onClick={() => action(menu, setMenu)} className="context-menu__item">
          {title}
        </div>
      ))}
    </div>
  ) : null
}

const mapDispatchToProps = { updateUnis }
export default connect(null, mapDispatchToProps)(OptionsMenu)
