import React, { useState, useEffect, useMemo } from 'react'

import SidePanel from './components/SidePanel/SidePanel'
import SchemePanel from './components/schemePanel/SchemePanel'

import './App.scss'

import AddSchemeModal from './components/addSchemeModal/AddSchemeModal'
import SettingsModal from './components/settingsModal/SettingsModal'
import JsonForm from './components/JsonForm/JsonForm'

const App = () => {
  const [schemes, setSchemes] = useState([])

  const [activeSchemeId, setActiveSchemeId] = useState('')

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  let activeScheme = useMemo(
    () => schemes.find((scheme) => scheme.id === activeSchemeId),
    [schemes, activeSchemeId]
  )

  useEffect(() => {
    let data = { ...window.localStorage }

    if (data.active) {
      setActiveSchemeId(data.active)
      delete data.active
    }

    if (!data.seperator) {
      window.localStorage.setItem('seperator', ',')
    }
    delete data.seperator

    setSchemes(Object.values(data).map((schema) => JSON.parse(schema)))
  }, [])

  return (
    <div className="App">
      <SidePanel
        setIsAddModalOpen={setIsAddModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
      />
      <SchemePanel
        schemes={schemes}
        setSchemes={setSchemes}
        setActiveSchemeId={setActiveSchemeId}
        activeSchemeId={activeSchemeId}
      />
      <JsonForm activeScheme={activeScheme} />

      <AddSchemeModal
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
        }}
        schemes={schemes}
        setSchemes={setSchemes}
      />

      <SettingsModal
        open={isSettingsModalOpen}
        onClose={() => {
          setIsSettingsModalOpen(false)
        }}
      />
    </div>
  )
}

export default App
