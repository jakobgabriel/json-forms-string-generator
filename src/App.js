import React, { useState, useEffect, useMemo } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './App.scss'

import Schemes from './windows/schemes/Schemes'
import Documentation from './windows/documentation/Documentation'
import SidePanel from './components/SidePanel/SidePanel'
import SettingsModal from './components/settingsModal/SettingsModal'

const App = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const [schemes, setSchemes] = useState([])
  const [activeSchemeId, setActiveSchemeId] = useState('')

  let activeScheme = useMemo(() => {
    if (schemes.length === 1) setActiveSchemeId(schemes[0].id)
    return schemes.find((scheme) => scheme.id === activeSchemeId)
  }, [schemes, activeSchemeId])

  useEffect(() => {
    let data = { ...window.localStorage }

    if (data.active) {
      setActiveSchemeId(data.active)
      delete data.active
    }

    setSchemes(Object.values(data).map((schema) => JSON.parse(schema)))
  }, [])

  return (
    <div className="App">
      <HashRouter>
        <SidePanel
          setIsAddModalOpen={setIsAddModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Schemes
                schemes={schemes}
                setSchemes={setSchemes}
                activeScheme={activeScheme}
                activeSchemeId={activeSchemeId}
                setActiveSchemeId={setActiveSchemeId}
                isAddModalOpen={isAddModalOpen}
                setIsAddModalOpen={setIsAddModalOpen}
              />
            }
          ></Route>

          <Route path="/documentation" element={<Documentation />}></Route>
        </Routes>
      </HashRouter>

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
