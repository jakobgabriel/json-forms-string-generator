import { UPDATEUNIS } from '../actions/types'
import { ipcRenderer } from 'electron'

import debounce from 'lodash.debounce'

// const storage = require("electron-json-storage")

// import store from "../"

import { saveUniAuto } from '../actions'

let save = debounce((unis) => {
  saveUniAuto(unis)
}, 1000)

const uniReducer = (state = {}, action) => {
  if (action.type === UPDATEUNIS) {
    console.log(action)
    let newState = (() => {
      switch (action.payload.type) {
        case 'set-active-master-session': {
          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...state.variations[state.activeUniViewVariation.id],
                activeMasterSession: action.payload.data,
              },
            },
          }
        }

        case 'set-active-indy': {
          let activeUni = state.variations[state.activeUniViewVariation.id]
          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,
                masterSessions: {
                  ...activeUni.masterSessions,
                  [activeUni.activeMasterSession.id]: {
                    ...activeUni.masterSessions[
                      activeUni.activeMasterSession.id
                    ],
                    activeIndy: action.payload.data,
                  },
                },
              },
            },
          }
        }

        case 'update-indy-list': {
          let activeUni = state.variations[state.activeUniViewVariation.id]
          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,
                isSaved: false,
                masterSessions: {
                  ...activeUni.masterSessions,
                  [activeUni.activeMasterSession.id]: {
                    ...activeUni.masterSessions[
                      activeUni.activeMasterSession.id
                    ],
                    undoList: [
                      ...activeUni.masterSessions[
                        activeUni.activeMasterSession.id
                      ].undoList,
                      activeUni.masterSessions[
                        activeUni.activeMasterSession.id
                      ],
                    ],
                    indies: action.payload.data,
                  },
                },
              },
            },
          }
        }

        case 'update-indy': {
          let activeUni = state.variations[state.activeUniViewVariation.id]
          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,
                isSaved: false,
                masterSessions: {
                  ...activeUni.masterSessions,
                  [activeUni.activeMasterSession.id]: {
                    ...activeUni.masterSessions[
                      activeUni.activeMasterSession.id
                    ],
                    undoList: [
                      ...activeUni.masterSessions[
                        activeUni.activeMasterSession.id
                      ].undoList,
                      activeUni.masterSessions[
                        activeUni.activeMasterSession.id
                      ],
                    ],

                    masterView: {
                      ...activeUni.masterSessions[
                        activeUni.activeMasterSession.id
                      ].masterView,

                      [activeUni.masterSessions[
                        activeUni.activeMasterSession.id
                      ].activeMasterViewVariation.id]: {
                        ...activeUni.masterSessions[
                          activeUni.activeMasterSession.id
                        ].masterView[
                          activeUni.masterSessions[
                            activeUni.activeMasterSession.id
                          ].activeMasterViewVariation.id
                        ],

                        indies: {
                          ...activeUni.masterSessions[
                            activeUni.activeMasterSession.id
                          ].masterView[
                            activeUni.masterSessions[
                              activeUni.activeMasterSession.id
                            ].activeMasterViewVariation.id
                          ].indies,

                          [action.payload.id]: {
                            ...activeUni.masterSessions[
                              activeUni.activeMasterSession.id
                            ].masterView[
                              activeUni.masterSessions[
                                activeUni.activeMasterSession.id
                              ].activeMasterViewVariation.id
                            ].indies[action.payload.id],
                            ...action.payload.data,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          }
        }

        ///////////////////////////////////////////////

        case 'add-master-session': {
          let id = crypto.randomUUID()
          let noteId = crypto.randomUUID()
          let activeUni = state.variations[state.activeUniViewVariation.id]

          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,
                isSaved: false,
                masterSessions: {
                  ...activeUni.masterSessions,
                  [id]: {
                    ...action.payload.data,
                    id,
                    notes: {
                      [noteId]: {
                        id: noteId,
                        title: 'main',
                        note: '',
                        isCoreVariation: true,
                      },
                    },
                    activeNote: { id: noteId },
                    activeIndy: { type: 'NOTES' },
                    undoList: [],
                  },
                },
                activeMasterSession: { id },
              },
            },
          }
        }

        case 'update-master-session-list':
          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...state.variations[state.activeUniViewVariation.id],
                isSaved: false,
                masterSessions: action.payload.data,
                // orderUndoList: [
                //   ...state.variations[state.activeUniViewVariation.id].orderUndoList,
                //   state.variations[state.activeUniViewVariation.id],
                // ],
              },
            },
          }

        case 'set-active-master-session': {
          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...state.variations[state.activeUniViewVariation.id],
                activeMasterSession: action.payload.data,
              },
            },
          }
        }

        case 'update-master-session': {
          let activeUni = state.variations[state.activeUniViewVariation.id]

          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,

                isSaved:
                  action.payload.data.savedCombos || action.payload.data.notes
                    ? activeUni.isSaved
                    : false,
                masterSessions: {
                  ...activeUni.masterSessions,
                  [activeUni.activeMasterSession.id]: {
                    ...activeUni.masterSessions[
                      activeUni.activeMasterSession.id
                    ],
                    undoList:
                      action.payload.data.savedCombos ||
                      action.payload.data.notes
                        ? activeUni.masterSessions[
                            activeUni.activeMasterSession.id
                          ].undoList
                        : [
                            ...activeUni.masterSessions[
                              activeUni.activeMasterSession.id
                            ].undoList,
                            activeUni.masterSessions[
                              activeUni.activeMasterSession.id
                            ],
                          ],
                    ...action.payload.data,
                  },
                },
              },
            },
          }
        }

        case 'add-combo-to-master-session': {
          let activeUni = state.variations[action.payload.variationId]
          return {
            ...state,
            variations: {
              ...state.variations,
              [activeUni.id]: {
                ...activeUni,
                masterSessions: {
                  ...activeUni.masterSessions,
                  [action.payload.masterId]: {
                    ...activeUni.masterSessions[action.payload.masterId],

                    savedCombos: {
                      ...activeUni.masterSessions[action.payload.masterId]
                        .savedCombos,
                      [action.payload.title]: [
                        ...activeUni.masterSessions[action.payload.masterId]
                          .savedCombos[action.payload.title],
                        action.payload.data,
                      ],
                    },
                  },
                },
              },
            },
          }
        }

        case 'update-master-session-id': {
          let activeUni = state.variations[state.activeUniViewVariation.id]
          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,
                masterSessions: {
                  ...activeUni.masterSessions,
                  [action.payload.id]: {
                    ...activeUni.masterSessions[action.payload.id],
                    ...action.payload.data,
                  },
                },
              },
            },
          }
        }

        case 'update-master-session-id-id': {
          let targetedUni = state.variations[action.payload.id.uniSession]
          return {
            ...state,
            variations: {
              ...state.variations,
              [targetedUni.id]: {
                ...targetedUni,
                masterSessions: {
                  ...targetedUni.masterSessions,
                  [action.payload.id.masterSession]: {
                    ...targetedUni.masterSessions[
                      action.payload.id.masterSession
                    ],
                    ...action.payload.data,
                  },
                },
              },
            },
          }
        }

        case 'delete-master-session': {
          let activeUni = state.variations[state.activeUniViewVariation.id]
          let currentSessions = { ...activeUni.masterSessions }

          let deletedIndex = Object.keys(currentSessions).indexOf(
            action.payload.id
          )

          delete currentSessions[action.payload.id]

          let activeMasterSession = activeUni.activeMasterSession

          if (
            activeUni.activeMasterSession.id === action.payload.id &&
            deletedIndex !== 0
          ) {
            activeMasterSession = {
              id: Object.values(currentSessions)[deletedIndex - 1].id,
            }
          }

          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,
                isSaved: false,
                masterSessions: currentSessions,
                activeMasterSession,
              },
            },
          }
        }

        case 'duplicate-master-session': {
          let activeUni = state.variations[state.activeUniViewVariation.id]

          let currentSessions = { ...activeUni.masterSessions }

          let duplicateedIndex = Object.keys(currentSessions).indexOf(
            action.payload.id
          )

          let orderedItems = {}

          Object.entries(currentSessions).map(([id, item], index) => {
            if (index === duplicateedIndex) {
              orderedItems[id] = item
              let newId = crypto.randomUUID()
              orderedItems[newId] = { ...item, id: newId }
            } else orderedItems[id] = item
          })

          let activeMasterSession = activeUni.activeMasterSession

          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,
                isSaved: false,
                masterSessions: orderedItems,
                activeMasterSession,
              },
            },
          }
        }

        case 'update-active-masterView-of-targeted-masterSession': {
          let activeUni = state.variations[state.activeUniViewVariation.id]

          let targetedMasterSession =
            activeUni.masterSessions[action.payload.id]

          let activeMasterViewVariation =
            targetedMasterSession.masterView[
              targetedMasterSession.activeMasterViewVariation.id
            ]

          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,
                isSaved: false,
                masterSessions: {
                  ...activeUni.masterSessions,
                  [action.payload.id]: {
                    ...targetedMasterSession,

                    undoList: [
                      ...targetedMasterSession.undoList,
                      targetedMasterSession,
                    ],

                    masterView: {
                      ...targetedMasterSession.masterView,
                      [targetedMasterSession.activeMasterViewVariation.id]: {
                        ...activeMasterViewVariation,
                        ...action.payload.data,
                      },
                    },
                  },
                },
              },
            },
          }
        }

        case 'delete-indy-take': {
          let activeUni = state.variations[state.activeUniViewVariation.id]

          let activeMasterSession =
            activeUni.masterSessions[activeUni.activeMasterSession.id]

          let activeMasterViewVariation =
            activeMasterSession.masterView[
              activeMasterSession.activeMasterViewVariation.id
            ]

          let activeIndyVariation =
            activeMasterSession.masterView[
              activeMasterSession.activeMasterViewVariation.id
            ].indies[activeMasterSession.activeIndy.id]

          let currentTakes = { ...activeIndyVariation.savedTakes }
          delete currentTakes[action.payload.id]

          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,
                isSaved: false,
                masterSessions: {
                  ...activeUni.masterSessions,
                  [activeUni.activeMasterSession.id]: {
                    ...activeMasterSession,
                    undoList: [
                      ...activeMasterSession.undoList,
                      activeMasterSession,
                    ],

                    masterView: {
                      ...activeMasterSession.masterView,
                      [activeMasterSession.activeMasterViewVariation.id]: {
                        ...activeMasterViewVariation,
                        indies: {
                          ...activeMasterViewVariation.indies,
                          [activeIndyVariation.id]: {
                            ...activeMasterViewVariation.indies[
                              activeIndyVariation.id
                            ],
                            savedTakes: currentTakes,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          }
        }

        /////////////////////////////////////////////

        case 'set-active-masterview': {
          let activeUni = state.variations[state.activeUniViewVariation.id]
          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,
                masterSessions: {
                  ...activeUni.masterSessions,
                  [activeUni.activeMasterSession.id]: {
                    ...activeUni.masterSessions[
                      activeUni.activeMasterSession.id
                    ],
                    // undoList: action.payload.data.savedCombos
                    //   ? activeUni.masterSessions[activeUni.activeMasterSession.id].undoList
                    //   : [
                    //       ...activeUni.masterSessions[activeUni.activeMasterSession.id].undoList,
                    //       activeUni.masterSessions[activeUni.activeMasterSession.id],
                    //     ],
                    activeMasterViewVariation: action.payload.data,
                  },
                },
              },
            },
          }
        }

        case 'update-masterview-list': {
          let activeUni = state.variations[state.activeUniViewVariation.id]
          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,
                isSaved: false,
                masterSessions: {
                  ...activeUni.masterSessions,
                  [activeUni.activeMasterSession.id]: {
                    ...activeUni.masterSessions[
                      activeUni.activeMasterSession.id
                    ],

                    undoList: [
                      ...activeUni.masterSessions[
                        activeUni.activeMasterSession.id
                      ].undoList,
                      activeUni.masterSessions[
                        activeUni.activeMasterSession.id
                      ],
                    ],
                    masterView: action.payload.data,
                  },
                },
              },
            },
          }
        }

        case 'delete-masterview-variation': {
          let activeUni = state.variations[state.activeUniViewVariation.id]

          let activeMasterSession =
            activeUni.masterSessions[activeUni.activeMasterSession.id]

          let currentVariations = { ...activeMasterSession.masterView }
          let deletedIndex = Object.keys(currentVariations).indexOf(
            action.payload.id
          )
          delete currentVariations[action.payload.id]

          let activeMasterViewVariation =
            activeMasterSession.activeMasterViewVariation
          if (
            activeMasterSession.activeMasterViewVariation.id ===
            action.payload.id
          ) {
            activeMasterViewVariation = {
              id: Object.values(currentVariations)[deletedIndex - 1].id,
            }
          }

          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,
                isSaved: false,
                masterSessions: {
                  ...activeUni.masterSessions,
                  [activeUni.activeMasterSession.id]: {
                    ...activeMasterSession,
                    undoList: [
                      ...activeMasterSession.undoList,
                      activeMasterSession,
                    ],

                    masterView: currentVariations,

                    activeMasterViewVariation,
                  },
                },
              },
            },
          }
        }

        ////////////////////////////////////////////

        case 'set-active-note': {
          let activeUni = state.variations[state.activeUniViewVariation.id]

          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,
                masterSessions: {
                  ...activeUni.masterSessions,
                  [activeUni.activeMasterSession.id]: {
                    ...activeUni.masterSessions[
                      activeUni.activeMasterSession.id
                    ],
                    activeNote: action.payload.data,
                  },
                },
              },
            },
          }
        }

        case 'update-notes-list': {
          let activeUni = state.variations[state.activeUniViewVariation.id]

          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,
                masterSessions: {
                  ...activeUni.masterSessions,
                  [activeUni.activeMasterSession.id]: {
                    ...activeUni.masterSessions[
                      activeUni.activeMasterSession.id
                    ],
                    undoList: [
                      ...activeUni.masterSessions[
                        activeUni.activeMasterSession.id
                      ].undoList,
                      activeUni.masterSessions[
                        activeUni.activeMasterSession.id
                      ],
                    ],
                    notes: action.payload.data,
                  },
                },
              },
            },
          }
        }

        case 'delete-note-variation': {
          let activeUni = state.variations[state.activeUniViewVariation.id]

          let activeMasterSession =
            activeUni.masterSessions[activeUni.activeMasterSession.id]

          let currentVariations = { ...activeMasterSession.notes }

          let deletedIndex = Object.keys(currentVariations).indexOf(
            action.payload.id
          )
          delete currentVariations[action.payload.id]

          let activeNote = activeMasterSession.activeNote

          if (activeMasterSession.activeNote.id === action.payload.id) {
            activeNote = {
              id: Object.values(currentVariations)[deletedIndex - 1].id,
            }
          }

          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,
                isSaved: false,
                masterSessions: {
                  ...activeUni.masterSessions,
                  [activeUni.activeMasterSession.id]: {
                    ...activeUni.masterSessions[
                      activeUni.activeMasterSession.id
                    ],
                    undoList: [
                      ...activeUni.masterSessions[
                        activeUni.activeMasterSession.id
                      ].undoList,
                      activeUni.masterSessions[
                        activeUni.activeMasterSession.id
                      ],
                    ],

                    notes: currentVariations,
                    activeNote,
                  },
                },
              },
            },
          }
        }

        ///////////////////////////////////////////////

        case 'add-uni-variation': {
          return {
            ...state,
            variations: {
              ...state.variations,
              [action.payload.id]: {
                ...state.variations[state.activeUniViewVariation.id],
                isSaved: false,

                ...action.payload.data,
              },
            },
            activeUniViewVariation: { id: action.payload.id },
          }
        }

        case 'update-uni-session-variation-list': {
          return {
            ...state,
            variations: action.payload.data,
          }
        }

        case 'set-active-uni-session-variation': {
          return {
            ...state,
            activeUniViewVariation: action.payload.data,
          }
        }

        case 'set-active-masterSession-masterView': {
          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...state.variations[state.activeUniViewVariation.id],
                activeMasterSession: action.payload.data,

                masterSessions: {
                  ...state.variations[state.activeUniViewVariation.id]
                    .masterSessions,
                  [action.payload.data.id]: {
                    ...state.variations[state.activeUniViewVariation.id]
                      .masterSessions[action.payload.data.id],
                    activeIndy: { type: 'VIEW' },
                  },
                },
              },
            },
          }
        }

        case 'update-uni-session-variation': {
          let activeUni = state.variations[state.activeUniViewVariation.id]

          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,
                isSaved: false,
                ...action.payload.data,
              },
            },
          }
        }

        case 'delete-uni-variation': {
          let currentVariations = { ...state.variations }

          let deletedIndex = Object.keys(currentVariations).indexOf(
            action.payload.id
          )
          delete currentVariations[action.payload.id]

          let activeUniViewVariation = state.activeUniViewVariation

          if (activeUniViewVariation.id === action.payload.id) {
            activeUniViewVariation = {
              id: Object.values(currentVariations)[deletedIndex - 1].id,
            }
          }

          return {
            ...state,
            variations: currentVariations,
            activeUniViewVariation,
          }
        }

        case 'update-uni-session':
          return {
            ...state,
            ...action.payload.data,
          }

        case 'update-uni': {
          return action.payload.data
        }

        case 'new-uni': {
          let vId = crypto.randomUUID()
          return {
            title: action.payload.data.title,
            project: action.payload.data.project,
            id: crypto.randomUUID(),
            variations: {
              [vId]: {
                id: vId,
                title: 'Core',
                masterSessions: {},
                activeMasterSession: {},
                isSaved: false,
                isCoreVariation: true,
              },
            },
            activeUniViewVariation: { id: vId },
            itoStamp: true,
            isNew: true,
          }
        }

        case 'save-uni': {
          let activeUni = state.variations[state.activeUniViewVariation.id]

          // return state
          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,
                isSaved: true,
              },
            },
            isNew: false,
            ...action.payload.data,
          }
        }

        /////////////////////////////////////////////
        case 'undo': {
          let activeUni = state.variations[state.activeUniViewVariation.id]
          return {
            ...state,
            variations: {
              ...state.variations,
              [state.activeUniViewVariation.id]: {
                ...activeUni,
                isSaved: false,
                masterSessions: {
                  ...activeUni.masterSessions,
                  [activeUni.activeMasterSession.id]:
                    activeUni.masterSessions[
                      activeUni.activeMasterSession.id
                    ].undoList.pop(),
                },
              },
            },
          }
        }
      }
    })()

    // if (window.location.hash.split("/").slice(-1)[0] === "dashboard") {
    //   // console.log("sending state")
    //   ipcRenderer.send("state", { unis: newState })
    // }

    if (action.settings) {
      if (action.settings.autoSave) {
        if (
          ![
            'set-active-master-session',
            'set-active-indy',
            'set-active-master-session',
            'set-active-masterview',
            'set-active-note',
            'set-active-uni-session-variation',
            'set-active-masterSession-masterView',
            'new-uni',
            'save-uni',
            'update-uni',
            // "undo",
            'set',
          ].includes(action.payload.type) &&
          !(
            action.payload.type === 'update-indy' &&
            action.payload.data.comboValues
          )
        ) {
          save(newState)
        }
      }
    }

    return newState
  }

  return state
}

export default uniReducer

// let count = 3

// let getData = () => {
//   let vId = crypto.randomUUID()
//   count--

//   let data = {
//     title: "Untitled",
//     id: crypto.randomUUID(),
//     variations: {
//       [vId]: {
//         id: vId,
//         title: "Core",
//         masterSessions: {},
//         activeMasterSession: {},
//         isSaved: true,
//         variation: 0,
//         orderUndoList: [],
//       },
//     },
//     activeUniViewVariation: { id: vId },
//   }

//   if (count === 0) {
//     // storage.setDataPath(app.getPath("appData") + "/ito")

//     // let settings = storage.getSync("settings")

//     let settings = settingsStore.get("settings")

//     if (!settings) {
//       settings = { autoSave: false, homeFolder: app.getPath("desktop"), openedUni: { id: data.id } }
//       // storage.setDataPath(app.getPath("appData") + "/ito")
//       // storage.set("settings", settings)

//       settingsStore.set("settings", settings)

//       storage.setDataPath(settings.homeFolder + "/ito/main/projects/default")
//       storage.set(data.title, data)
//     } else {
//       storage.setDataPath(settings.homeFolder + "/ito/main/projects/default")
//       data = storage.getSync(settings.openedUni.id)

//       if (isObjectEmpty(data)) {
//         data = {
//           title: "Untitled",
//           id: crypto.randomUUID(),
//           variations: {
//             [vId]: {
//               id: vId,
//               title: "Core",
//               masterSessions: {},
//               activeMasterSession: {},
//               isSaved: true,
//               variation: 0,
//               orderUndoList: [],
//             },
//           },
//           activeUniViewVariation: { id: vId },
//         }

//         settingsStore.set("settings", { ...settings, openedUni: { id: data.id } })
//         storage.setDataPath(settings.homeFolder + "/ito/main/projects/default")
//         storage.set(data.title, data)
//       }
//     }
//   }
