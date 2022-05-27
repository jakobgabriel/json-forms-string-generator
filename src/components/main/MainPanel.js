import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'
import debounce from 'lodash.debounce'
import store from '../..'

import { getActives } from '../../Funtions'
import { updateUnis, saveUni, saveUniDup, updateIsOpen } from '../../actions'

import MasterSessionsNav from '../master/MasterSessionsNav'
import ConfirmModal from '../modals/ConfirmModal'
import OptionsMenu from './OptionsMenu'
import NewUniSession from '../modals/NewUniSession'
import NewMasterSession from '../modals/NewMasterSession'
import NamingModal from '../modals/NamingModal'

const MainPanel = ({
  masterSessions,
  updateUnis,
  saveUni,
  activeMasterSession,
  isUniOpened,
  homeFolderPath,
  project,
  updateIsOpen,
}) => {
  const [menu, setMenu] = useState({ isOpen: false })

  const [isNamingModalOpened, setIsNamingModalOpened] = useState(false)
  const [isAddUniSessionOpen, setIsAddUniSessionOpen] = useState(false)
  const [isAddMasterSessionOpen, setIsAddMasterSessionOpen] = useState(false)

  const debouncedSaveChangess = useMemo(
    () => debounce(saveUni, 1000, { leading: true, trailing: false }),
    []
  )

  const newUni = () => {
    setIsAddUniSessionOpen(true)
  }

  const dupUni = (title) => {
    saveUniDup(title)
    window.notify('Saved Duplicate')
  }

  const addMasterSession = () => {
    setIsAddMasterSessionOpen(true)
  }

  const openUniSummaryView = () => {
    ipcRenderer.send('open-uni-summary', store.getState())
  }

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    setIsOpen: (value) => setConfirmModal({ ...confirmModal, open: value }),
    title: '',
    message: '',
    icon: '',
    isOpen: false,
    btns: [],
  })

  const openUni = () => {
    const { dialog, BrowserWindow } = require('@electron/remote')
    console.log(homeFolderPath + '/ito/main/projects')
    dialog
      .showOpenDialog(BrowserWindow.getFocusedWindow(), {
        properties: ['openFile'],
        defaultPath: homeFolderPath + '/ito/main/projects',
        filters: [
          {
            name: 'json',
            extensions: ['json'],
          },
        ],
      })
      .then((result) => {
        if (!result.canceled) {
          const fs = require('fs')

          if (isUniOpened)
            setConfirmModal({
              ...confirmModal,
              title: 'Opening new file',
              message: 'Do you want to save the current file ?',
              icon: 'delete',
              isOpen: true,
              btns: [
                {
                  name: 'Save',
                  action: () => {
                    saveUni()
                    setTimeout(() => {
                      updateIsOpen({ isLoadingOpen: true })
                      fs.readFile(result.filePaths[0], (err, data) => {
                        if (!err) {
                          let parsed = JSON.parse(data)
                          if (parsed.itoStamp) {
                            updateUnis('update-uni', {})
                            ipcRenderer.send('open-uni', {
                              ...parsed,
                              path: result.filePaths[0].replaceAll('\\', '/'),
                            })
                          }
                        } else {
                          updateIsOpen({ isLoadingOpen: false })
                        }
                      })
                    }, 250)
                  },
                },
                {
                  name: "Don't Save",
                  action: () => {
                    updateIsOpen({ isLoadingOpen: true })
                    fs.readFile(result.filePaths[0], (err, data) => {
                      if (!err) {
                        let parsed = JSON.parse(data)
                        if (parsed.itoStamp) {
                          updateUnis('update-uni', {})
                          ipcRenderer.send('open-uni', {
                            ...parsed,
                            path: result.filePaths[0].replaceAll('\\', '/'),
                          })
                        }
                      } else {
                        updateIsOpen({ isLoadingOpen: false })
                      }
                    })
                  },
                },
                {
                  name: 'Cancel',
                  action: () => {},
                },
              ],
            })
          else {
            updateIsOpen({ isLoadingOpen: true })

            fs.readFile(result.filePaths[0], (err, data) => {
              if (!err) {
                let parsed = JSON.parse(data)
                if (parsed.itoStamp)
                  ipcRenderer.send('open-uni', {
                    ...parsed,
                    path: result.filePaths[0].replaceAll('\\', '/'),
                  })
              } else {
                updateIsOpen({ isLoadingOpen: false })
              }
            })
          }
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className="main-panel">
      <div className="main-panel__btn-group">
        <div onClick={newUni} className="btn btn--uni">
          New UNI
        </div>
        <div onClick={openUni} className="btn btn--uni">
          Open UNI
        </div>

        <div
          onClick={debouncedSaveChangess}
          className={`btn btn--uni ${isUniOpened ? '' : 'disable'}`}
        >
          Save UNI
        </div>
        <div
          onClick={() => setIsNamingModalOpened(!isNamingModalOpened)}
          className={`btn btn--uni ${isUniOpened ? '' : 'disable'}`}
        >
          UNI Save Duplicate
        </div>
        <div
          onClick={openUniSummaryView}
          className={`btn btn--uni ${isUniOpened ? '' : 'disable'}`}
        >
          UNI Summary View
        </div>
        <div
          onClick={addMasterSession}
          className={`btn btn--uni ${isUniOpened ? '' : 'disable'}`}
        >
          Add Master Session
        </div>
        {/* 
        <div onClick={undoOrder} className="btn btn--uni">
          Undo Order
        </div> */}
      </div>

      <MasterSessionsNav
        items={masterSessions}
        axis="y"
        presentedList={{}}
        updateList={(newList) =>
          updateUnis('update-master-session-list', newList)
        }
        itemClick={(session) =>
          updateUnis('set-active-master-session', session)
        }
        updateItem={(data) => updateUnis('update-master-session', data)}
        activeMasterSession={activeMasterSession}
        setMenu={setMenu}
      />

      <ConfirmModal {...confirmModal} />
      <OptionsMenu
        menu={menu}
        setMenu={setMenu}
        options={[
          {
            title: 'Delete Session',
            action: (menu, setMenu) => {
              setMenu({ isOpen: false })
              setConfirmModal({
                ...confirmModal,
                title: 'Delete A Master Session',
                message:
                  'Are you sure you want to delete this master session ?',
                isOpen: true,
                btns: [
                  {
                    name: 'Yes',
                    action: () =>
                      updateUnis('delete-master-session', null, menu.id),
                  },
                  {
                    name: 'No',
                    action: () => {},
                  },
                ],
              })
            },
          },

          {
            title: 'Duplicate Session',
            action: () => {
              setMenu({ isOpen: false })
              updateUnis('duplicate-master-session', null, menu.id)
            },
          },
        ]}
      />
      <NewMasterSession
        isOpen={isAddMasterSessionOpen}
        setIsOpen={setIsAddMasterSessionOpen}
        updateUnis={updateUnis}
        saveUni={saveUni}
        updateIsOpen={updateIsOpen}
      />

      <NewUniSession
        isOpen={isAddUniSessionOpen}
        setIsOpen={setIsAddUniSessionOpen}
        updateUnis={updateUnis}
        isUniOpened={isUniOpened}
        setConfirmModal={setConfirmModal}
        confirmModal={confirmModal}
        saveUni={saveUni}
        homeFolderPath={homeFolderPath}
      />

      <NamingModal
        isOpen={isNamingModalOpened}
        setIsOpen={setIsNamingModalOpened}
        action={dupUni}
        project={project}
        homeFolderPath={homeFolderPath}
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  let { activeUniVariation, activeMasterSession, isUniOpened } =
    getActives(state)
  return {
    masterSessions: activeUniVariation.masterSessions,
    activeMasterSession,
    isUniOpened,
    homeFolderPath: state.settings.homeFolder,
    project: state.unis.project,
  }
}

const mapDispatchToProps = { updateUnis, saveUni, updateIsOpen }
export default connect(mapStateToProps, mapDispatchToProps)(MainPanel)
