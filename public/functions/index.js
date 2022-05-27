const crypto = require('crypto')

const decodeExcelFile = (data) => {
  let ready = {}
  let firstSheet = true
  Object.entries(data.Sheets).map(([indy, data]) => {
    let currentColumn = ''
    let currentColumnName = ''
    let syboleToName = {}

    if (firstSheet) {
      indy = 'savedCombos'
      firstSheet = false
    }

    Object.entries(data).map(([key, rowData]) => {
      if (!['!margins', '!ref', '!rows', '!cols'].includes(key)) {
        currentColumn = key.slice(0, 1)
        if (key.slice(1) === '1') {
          currentColumnName = rowData.v
          syboleToName[currentColumn] = currentColumnName
        }
        if (ready[indy]) {
          if (ready[indy][syboleToName[currentColumn]])
            ready[indy][syboleToName[currentColumn]].push(rowData.v)
          else {
            ready = {
              ...ready,
              [indy]: { ...ready[indy], [syboleToName[currentColumn]]: [] },
            }
          }
        } else
          ready = {
            ...ready,
            [indy]: { ...ready[indy], [syboleToName[currentColumn]]: [] },
          }
      }
    })
  })

  let vId = crypto.randomUUID()

  let toSubmit = { indies: {}, masterView: { [vId]: { indies: {} } } }
  let isSourceAvailable = true

  Object.entries(ready).map(([key, data]) => {
    let comboValues = {}

    let id = crypto.randomUUID()
    if (key === 'savedCombos') {
      toSubmit = { ...toSubmit, [key]: data }
    } else {
      Object.keys(data).map((key) => {
        if (data[key].length === 0) isSourceAvailable = false
        comboValues[key] = { value: '', isLocked: false, isDisabled: false }
      })

      // masterView[key] = {}

      toSubmit = {
        ...toSubmit,
        indies: {
          ...toSubmit.indies,
          [id]: {
            title: key,
            id,
            data,
            isSourceAvailable,
            type: 'INDY',
            // combo: { a: "", b: "" },
            // comboValues: { a: { ...comboValues }, b: { ...comboValues } },
            // savedTakes: {},
          },
        },

        masterView: {
          [vId]: {
            indies: {
              ...toSubmit.masterView[vId].indies,
              [id]: {
                title: key,
                id,
                // data,
                // isSourceAvailable,
                type: 'INDY',
                combo: { a: '', b: '' },
                comboValues: { a: { ...comboValues }, b: { ...comboValues } },
                savedTakes: {},
              },
            },
          },
        },
      }
    }
  })

  let l = Object.values(toSubmit.indies)[0]

  return {
    ...toSubmit,
    masterView: {
      [vId]: {
        ...toSubmit.masterView[vId],
        id: vId,
        title: 'Core Master',
        isCoreVariation: true,
        takes: {},
        presentedTake: { title: l.title },
      },
    },
    activeMasterViewVariation: { id: vId },
  }
}

////////////////////////

const decodeExcelFileRow = (data) => {
  let ready = {}
  let firstSheet = true
  Object.entries(data.Sheets).map(([indy, data]) => {
    let currentColumn = ''
    let currentColumnName = ''
    let syboleToName = {}

    if (firstSheet) {
      indy = 'savedCombos'
      firstSheet = false
    }

    Object.entries(data).map(([key, rowData]) => {
      if (!['!margins', '!ref', '!rows', '!cols'].includes(key)) {
        currentColumn = key.slice(0, 1)
        if (key.slice(1) === '1') {
          currentColumnName = rowData.v
          syboleToName[currentColumn] = currentColumnName
        }
        if (ready[indy]) {
          if (ready[indy][syboleToName[currentColumn]])
            ready[indy][syboleToName[currentColumn]].push(rowData.v)
          else {
            ready = {
              ...ready,
              [indy]: { ...ready[indy], [syboleToName[currentColumn]]: [] },
            }
          }
        } else
          ready = {
            ...ready,
            [indy]: { ...ready[indy], [syboleToName[currentColumn]]: [] },
          }
      }
    })
  })
  let filted = { savedCombos: ready.savedCombos }
  delete ready['savedCombos']
  return { ...filted, data: ready }
}

/////////////////////////

module.exports = { decodeExcelFile, decodeExcelFileRow }
