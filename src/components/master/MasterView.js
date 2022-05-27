import React from "react"

import MasterViewNav from "./MasterViewNav"
import MasterViewTakesGroup from "./MasterViewTakesGroup"

const MasterView = ({ updateUnis, homeFolderPath }) => {
  return (
    <div className="masterview">
      <div className="masterview__title">Master View</div>
      <MasterViewNav updateUnis={updateUnis} />
      <MasterViewTakesGroup updateUnis={updateUnis} homeFolderPath={homeFolderPath} />
    </div>
  )
}

export default MasterView
