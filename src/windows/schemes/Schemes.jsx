import React, { useState, useEffect, useMemo } from 'react'
import './schemes.scss'

import JsonForm from '../../components/JsonForm/JsonForm'
import SchemePanel from '../../components/schemePanel/SchemePanel'
import AddSchemeModal from '../../components/addSchemeModal/AddSchemeModal'

const Schemes = ({
  schemes,
  setSchemes,
  activeScheme,
  activeSchemeId,
  setActiveSchemeId,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const [toEditSchema, setToEditSchema] = useState(null)

  return (
    <div className="schemes">
      <SchemePanel
        schemes={schemes}
        setSchemes={setSchemes}
        setActiveSchemeId={setActiveSchemeId}
        activeSchemeId={activeSchemeId}
        setIsAddModalOpen={setIsAddModalOpen}
        setToEditSchema={setToEditSchema}
      />

      <JsonForm activeScheme={activeScheme} activeSchemeId={activeSchemeId} />

      <AddSchemeModal
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setTimeout(() => {
            setToEditSchema(null)
          }, 300)
        }}
        schemes={schemes}
        setSchemes={setSchemes}
        toEditSchema={toEditSchema}
      />
    </div>
  )
}

export default Schemes
