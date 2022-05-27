import {
  UPDATEISOPEN,
  UPDATEUNIS,
  UPDATERECENTGENERATIONS,
  UPDATESETTINGS,
} from './types'
import { ipcRenderer } from 'electron'
import fs from 'fs'
import store from '..'

export const updateIsOpen = (data) => ({
  type: UPDATEISOPEN,
  payload: data,
})

//////////////////////////////////////////////////////////////////

export const updateUnis = (type, data, id) => {
  let state = store.getState()
  let settings = state.settings

  return {
    type: UPDATEUNIS,
    payload: { type, data, id },
    settings,
  }
}

export const moveHomeFolder = (oldPath, newPath) => {
  console.log(oldPath, newPath)
  let mv = require('mv')
  const path = require('path')
  let unis = store.getState().unis

  let isCurrentOpen = false

  if (fs.existsSync(oldPath + '/main/projects'))
    mv(oldPath, newPath, { mkdirp: true }, function (err) {
      window.notify('Moving files')

      if (!err) {
        if (fs.existsSync(`${newPath}/main/projects`)) {
          const projects = fs
            .readdirSync(`${newPath}/main/projects`)
            .filter((file) => path.extname(file) === '')

          projects.forEach((project) => {
            const jsonsInDir = fs
              .readdirSync(`${newPath}/main/projects/${project}`)
              .filter((file) => path.extname(file) === '.json')

            jsonsInDir.forEach((json) => {
              const fileData = fs
                .readFileSync(
                  path.join(`${newPath}/main/projects/${project}`, json)
                )
                .toString()

              if (fileData) {
                let parsed = JSON.parse(fileData.toString())
                if (parsed.itoStamp) {
                  parsed.path = parsed.path.replace(oldPath, newPath)

                  if (unis) {
                    if (unis.id === parsed.id) {
                      store.dispatch({
                        type: UPDATEUNIS,
                        payload: {
                          type: 'update-uni-session',
                          data: { path: parsed.path },
                        },
                      })

                      isCurrentOpen = true
                    } else isCurrentOpen = false
                  }

                  Object.values(parsed.variations).map((uniVariation) => {
                    Object.values(uniVariation.masterSessions).map(
                      (masterSession) => {
                        if (
                          masterSession.path.includes(oldPath + '/main/excel')
                        ) {
                          console.log('located in', masterSession.path)

                          masterSession.path = masterSession.path.replace(
                            oldPath,
                            newPath
                          )

                          if (isCurrentOpen)
                            store.dispatch({
                              type: UPDATEUNIS,
                              payload: {
                                type: 'update-master-session-id-id',
                                data: { path: masterSession.path },
                                id: {
                                  uniSession: uniVariation.id,
                                  masterSession: masterSession.id,
                                },
                              },
                            })
                        } else console.log('located out', masterSession.path)
                      }
                    )
                  })

                  fs.writeFileSync(parsed.path, JSON.stringify(parsed))
                  fs.writeFileSync(
                    parsed.path.replace('main', 'backup'),
                    JSON.stringify(parsed)
                  )
                  console.log('finished writing')
                }
              }
            })
          })
        }

        // if (unis)
        //   store.dispatch({
        //     type: UPDATEUNIS,
        //     payload: {
        //       type: 'update-uni',
        //       data: unis,
        //     },
        //   })
      } else window.notify('can not move home folder')
    })
}

export const saveSession = (sessionId, uniVariationId) => {
  let state = store.getState()
  let backupPath = state.unis.path.replace('main', 'backup')

  let activeUniVariation = state.unis.variations[uniVariationId]

  let activeMasterSession = activeUniVariation.masterSessions[sessionId]

  let uni = {}

  if (fs.existsSync(state.unis.path)) {
    fs.readFile(state.unis.path, (err, data) => {
      if (!err) {
        let parsed = JSON.parse(data)
        if (parsed.itoStamp) {
          uni = parsed
        }
        uni = {
          ...uni,
          variations: {
            ...uni.variations,
            [uniVariationId]: {
              ...(uni.variations[uniVariationId]
                ? uni.variations[uniVariationId]
                : activeUniVariation),
              masterSessions: {
                ...(uni.variations[uniVariationId]
                  ? uni.variations[uniVariationId].masterSessions
                  : {}),
                [activeMasterSession.id]: {
                  ...activeMasterSession,
                  undoList: [],
                },
              },
            },
          },
        }

        fs.writeFile(state.unis.path, JSON.stringify(uni), (err) => {
          if (!err) window.notify('Session Saved')
          else window.notify('can not save file')
        })

        if (!fs.existsSync(backupPath)) {
          fs.mkdirSync(backupPath, {
            recursive: true,
          })
        }

        fs.writeFile(backupPath, JSON.stringify(uni), (err) => {
          if (err) console.log(err)
        })
      }
    })
  } else {
    if (fs.existsSync(backupPath)) {
      fs.readFile(backupPath, (err, data) => {
        if (!err) {
          let parsed = JSON.parse(data)
          if (parsed.itoStamp) {
            uni = parsed
          }
          uni = {
            ...uni,
            variations: {
              ...uni.variations,
              [uniVariationId]: {
                ...(uni.variations[uniVariationId]
                  ? uni.variations[uniVariationId]
                  : activeUniVariation),
                masterSessions: {
                  ...(uni.variations[uniVariationId]
                    ? uni.variations[uniVariationId].masterSessions
                    : {}),
                  [activeMasterSession.id]: {
                    ...activeMasterSession,
                    undoList: [],
                  },
                },
              },
            },
          }

          fs.writeFile(state.unis.path, JSON.stringify(uni), (err) => {
            if (!err) window.notify('Session Saved')
            else window.notify('can not save file')
          })

          if (!fs.existsSync(backupPath)) {
            fs.mkdirSync(backupPath, {
              recursive: true,
            })
          }

          fs.writeFile(backupPath, JSON.stringify(uni), (err) => {
            if (err) console.log(err)
          })
        }
      })
    }
  }
}

export const saveUni = () => {
  let state = store.getState()

  let unis = {
    ...state.unis,
    variations: (() => {
      let variations = {}
      Object.values(state.unis.variations).map((variation) => {
        variations[variation.id] = {
          ...variation,
          // isSaved: true,
          masterSessions: (() => {
            let masterSessions = {}
            Object.values(variation.masterSessions).map((masterSession) => {
              masterSessions[masterSession.id] = {
                ...masterSession,
                undoList: [],
              }
            })
            return masterSessions
          })(),
        }
      })

      return variations
    })(),
  }

  let settings = state.settings
  let activeUni = unis.variations[unis.activeUniViewVariation.id]

  if (
    !fs.existsSync(settings.homeFolder + `/ito/main/projects/${unis.project}`)
  ) {
    fs.mkdirSync(settings.homeFolder + `/ito/main/projects/${unis.project}`, {
      recursive: true,
    })
  }

  fs.writeFile(
    settings.homeFolder +
      `/ito/main/projects/${unis.project}/${unis.title}.json`,
    JSON.stringify({
      ...unis,
      variations: {
        ...unis.variations,
        [unis.activeUniViewVariation.id]: {
          ...activeUni,
          isSaved: true,
        },
      },
      isNew: false,
      path:
        settings.homeFolder +
        `/ito/main/projects/${unis.project}/` +
        unis.title +
        '.json',
    }),
    (err) => {
      if (err) console.log(err)
    }
  )

  if (
    !fs.existsSync(settings.homeFolder + `/ito/backup/projects/${unis.project}`)
  ) {
    fs.mkdirSync(settings.homeFolder + `/ito/backup/projects/${unis.project}`, {
      recursive: true,
    })
  }

  fs.writeFile(
    settings.homeFolder +
      `/ito/backup/projects/${unis.project}/${unis.title}.json`,
    JSON.stringify({
      ...unis,
      variations: {
        ...unis.variations,
        [unis.activeUniViewVariation.id]: {
          ...activeUni,
          isSaved: true,
        },
      },
      isNew: false,
      path:
        settings.homeFolder +
        `/ito/backup/projects/${unis.project}/` +
        unis.title +
        '.json',
    }),
    (err) => {
      if (err) console.log(err)

      window.notify('Uni Saved')
    }
  )

  return {
    type: UPDATEUNIS,
    payload: {
      type: 'save-uni',
      data: {
        path:
          settings.homeFolder +
          `/ito/main/projects/${unis.project}/` +
          unis.title +
          '.json',
      },
    },
    settings,
  }
}

export const saveUniAuto = (unisData) => {
  let unis = {
    ...unisData,
    variations: (() => {
      let variations = {}
      Object.values(unisData.variations).map((variation) => {
        variations[variation.id] = {
          ...variation,
          // isSaved: true,
          masterSessions: (() => {
            let masterSessions = {}
            Object.values(variation.masterSessions).map((masterSession) => {
              masterSessions[masterSession.id] = {
                ...masterSession,
                undoList: [],
              }
            })
            return masterSessions
          })(),
        }
      })

      return variations
    })(),
  }

  let state = store.getState()
  // let unis = state.unis
  let settings = state.settings
  let activeUni = unis.variations[unis.activeUniViewVariation.id]

  if (
    !fs.existsSync(settings.homeFolder + `/ito/main/projects/${unis.project}`)
  ) {
    fs.mkdirSync(settings.homeFolder + `/ito/main/projects/${unis.project}`, {
      recursive: true,
    })
  }

  fs.writeFile(
    settings.homeFolder +
      `/ito/main/projects/${unis.project}/${unis.title}.json`,
    JSON.stringify({
      ...unis,
      variations: {
        ...unis.variations,
        [unis.activeUniViewVariation.id]: {
          ...activeUni,
          isSaved: true,
        },
      },
      isNew: false,
      path:
        settings.homeFolder +
        `/ito/main/projects/${unis.project}/` +
        unis.title +
        '.json',
    }),
    (err) => {
      if (err) console.log(err)
    }
  )

  if (
    !fs.existsSync(settings.homeFolder + `/ito/backup/projects/${unis.project}`)
  ) {
    fs.mkdirSync(settings.homeFolder + `/ito/backup/projects/${unis.project}`, {
      recursive: true,
    })
  }

  fs.writeFile(
    settings.homeFolder +
      `/ito/backup/projects/${unis.project}/${unis.title}.json`,
    JSON.stringify({
      ...unis,
      variations: {
        ...unis.variations,
        [unis.activeUniViewVariation.id]: {
          ...activeUni,
          isSaved: true,
        },
      },
      isNew: false,
      path:
        settings.homeFolder +
        `/ito/backup/projects/${unis.project}/` +
        unis.title +
        '.json',
    }),
    (err) => {
      if (err) console.log(err)
    }
  )

  console.log('SAVED')

  store.dispatch({
    type: UPDATEUNIS,
    payload: {
      type: 'save-uni',
      data: {
        path:
          settings.homeFolder +
          `/ito/main/projects/${unis.project}/` +
          unis.title +
          '.json',
      },
    },
  })
}

export const saveUniDup = (title) => {
  let state = store.getState()
  let unis = state.unis
  let settings = state.settings
  let activeUni = unis.variations[unis.activeUniViewVariation.id]

  if (
    !fs.existsSync(settings.homeFolder + `/ito/main/projects/${unis.project}`)
  ) {
    fs.mkdirSync(settings.homeFolder + `/ito/main/projects/${unis.project}`, {
      recursive: true,
    })
  }

  fs.writeFile(
    settings.homeFolder + `/ito/main/projects/${unis.project}/${title}.json`,
    JSON.stringify({
      ...unis,
      title,
      variations: {
        ...unis.variations,
        [unis.activeUniViewVariation.id]: {
          ...activeUni,
          isSaved: true,
        },
      },
      isNew: false,
      path:
        settings.homeFolder +
        `/ito/main/projects/${unis.project}/${title}.json`,
    }),
    (err) => {
      if (err) console.log(err)
    }
  )

  if (
    !fs.existsSync(settings.homeFolder + `/ito/backup/projects/${unis.project}`)
  ) {
    fs.mkdirSync(settings.homeFolder + `/ito/backup/projects/${unis.project}`, {
      recursive: true,
    })
  }

  fs.writeFile(
    settings.homeFolder + `/ito/backup/projects/${unis.project}/${title}.json`,
    JSON.stringify({
      ...unis,
      title,
      variations: {
        ...unis.variations,
        [unis.activeUniViewVariation.id]: {
          ...activeUni,
          isSaved: true,
        },
      },
      isNew: false,
      path:
        settings.homeFolder +
        `/ito/backup/projects/${unis.project}/${title}.json`,
    }),
    (err) => {
      if (err) console.log(err)
    }
  )
}

export const updateUniSession = (data) => {
  let state = store.getState()
  let unis = state.unis
  let settings = state.settings

  if (data.title && !state.isNew) {
    let path = unis.path
      ? unis.path
      : settings.homeFolder +
        `/ito/main/projects/${unis.project}/` +
        unis.title +
        '.json'

    let newPath =
      path.split('/').slice(0, -1).join('/') + '/' + data.title + '.json'

    data = { ...data, path: newPath }

    if (fs.existsSync(path)) {
      fs.rename(path, newPath, function (err) {
        if (err) console.log('ERROR: ' + err)
      })

      /////////////////////
      if (
        !fs.existsSync(
          settings.homeFolder + `/ito/main/projects/${unis.project}`
        )
      ) {
        fs.mkdirSync(
          settings.homeFolder + `/ito/main/projects/${unis.project}`,
          {
            recursive: true,
          }
        )
      }

      fs.writeFile(
        settings.homeFolder +
          `/ito/main/projects/${unis.project}/${data.title}.json`,
        JSON.stringify({
          ...unis,
          title: data.title,
          path: newPath,
        }),
        (err) => {
          if (err) console.log(err)
        }
      )
    }
  }

  return {
    type: UPDATEUNIS,
    payload: { type: 'update-uni-session', data },
    settings,
  }
}

//////////////////////////////////////////////////////////////////

export const updateRecentGen = (data, id) => ({
  type: UPDATERECENTGENERATIONS,
  payload: { data, id },
})

export const updateSettings = (data) => ({
  type: UPDATESETTINGS,
  payload: { data },
})

/////////////////////////////////////////////////
ipcRenderer.on('open-uni', (e, data) => {
  store.dispatch({ type: UPDATEUNIS, payload: { type: 'update-uni', data } })

  store.dispatch({ type: UPDATEISOPEN, payload: { isLoadingOpen: false } })
})

ipcRenderer.on('update-active-ms-id', (e, data, id) => {
  store.dispatch({
    type: UPDATEUNIS,
    payload: { type: 'update-master-session-id', data, id },
  })
})

ipcRenderer.on('update-active-ms-save', (e, data) => {
  store.dispatch({
    type: UPDATEUNIS,
    payload: { type: 'update-master-session', data },
  })
  if (data.path) {
    /////////////////////
    let unis = store.getState().unis
    let activeUni = unis.variations[unis.activeUniViewVariation.id]

    fs.writeFile(
      unis.path,
      JSON.stringify({
        ...unis,
        variations: {
          ...unis.variations,
          [unis.activeUniViewVariation.id]: {
            ...activeUni,
            masterSessions: {
              ...activeUni.masterSessions,
              [activeUni.activeMasterSession.id]: {
                ...activeUni.masterSessions[activeUni.activeMasterSession.id],
                path: data.path,
              },
            },
          },
        },
      }),
      (err) => {
        if (err) console.log(err)
      }
    )
  }
})

ipcRenderer.on('stop-loading', () =>
  store.dispatch({
    type: UPDATEISOPEN,
    payload: { isLoadingOpen: false },
  })
)
