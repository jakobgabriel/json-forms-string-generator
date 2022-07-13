const ExcelJS = require('exceljs')
var XLSX = require('xlsx')
const fs = require('fs')

console.log = (meg) => {
  process.send({ data: meg })
}

const { decodeExcelFile, decodeExcelFileRow } = require('../functions')

process.on('message', ({ type, data }) => {
  switch (type) {
    case 'save-combo': {
      saveComboToFile(data)
        .then((d) =>
          process.send({
            type: 'save-combo',
            data: d.combo,
            extra: {
              title: d.title,
              variationId: d.variationId,
              masterId: d.masterId,
              removeal: d.removeal,
            },
          })
        )
        .catch((err) =>
          process.send({
            type: 'error',
            data: err,
            extra: { type, removeal: data.combo + data.title + data.masterId },
          })
        )
      break
    }
    case 'read-excel': {
      readExcelFile(data.path)
        .then((d) => process.send({ type, data: { ...d, title: data.title } }))
        .catch((err) => process.send({ type: 'error', data: err }))
      break
    }

    case 'open-uni': {
      readUni(data)
        .then((data) => process.send({ type, data }))
        .catch((err) => process.send({ type: 'error', data: err }))
      break
    }
  }
})

///////////////////////////////////////////////////

const readUni = (data) => {
  return new Promise((resolve, reject) => {
    try {
      let newData = {
        ...data,
        variations: (() => {
          let variations = {}
          Object.values(data.variations).map((variation) => {
            variations[variation.id] = {
              ...variation,
              isSaved: true,
              masterSessions: (() => {
                let masterSessions = {}
                Object.values(variation.masterSessions).map((masterSession) => {
                  let newIndies = {}

                  if (fs.existsSync(masterSession.path)) {
                    let workbook = XLSX.readFile(masterSession.path)
                    let decodedWorkbook = decodeExcelFileRow(workbook)

                    let comboValuesGroup = {}

                    Object.values(masterSession.indies).map((indy) => {
                      let newIndyData = decodedWorkbook.data[indy.title]

                      comboValuesGroup[indy.title] = {}

                      let isSourceAvailable = true

                      Object.keys(newIndyData).map((key) => {
                        if (newIndyData[key].length === 0)
                          isSourceAvailable = false
                        comboValuesGroup[indy.title][key] = {
                          value: '',
                          isLocked: false,
                          isDisabled: false,
                        }
                      })

                      newIndies[indy.id] = {
                        ...indy,
                        data: newIndyData ? newIndyData : indy.data,
                        isSourceAvailable,
                      }
                    })

                    let newMasterviews = {}

                    Object.entries(masterSession.masterView).map(
                      ([key, value]) => {
                        let newIndies = {}
                        Object.entries(value.indies).map(([key, value]) => {
                          newIndies[key] = {
                            ...value,
                            combo: { a: '', b: '' },
                            comboValues: {
                              a: comboValuesGroup[value.title],
                              b: comboValuesGroup[value.title],
                            },
                          }
                        })
                        newMasterviews[key] = {
                          ...value,
                          indies: newIndies,
                        }
                      }
                    )

                    masterSessions[masterSession.id] = {
                      ...masterSession,
                      savedCombos: decodedWorkbook.savedCombos,
                      indies: newIndies,
                      masterView: newMasterviews,
                      undoList: [],
                    }
                  } else {
                    masterSessions[masterSession.id] = {
                      ...masterSession,
                      undoList: [],
                    }
                  }
                })

                return masterSessions
              })(),
            }
          })

          return variations
        })(),
      }
      resolve(newData)
    } catch (err) {
      reject('Unable to open file')
    }
  })
}

///////////////////
const readExcelFile = (path) => {
  return new Promise((resolve, reject) => {
    try {
      let workbook = XLSX.readFile(path)
      let decodedData = decodeExcelFile(workbook)
      resolve({
        path,
        ...decodedData,
      })
    } catch (err) {
      reject('Unable to open file')
    }
  })
}

///////////////////

let workbooks = {}
let isReading = {}
let saveQueue = []

const saveComboToFile = ({
  readPath,
  writePath,
  combo,
  title,
  homeFolderPath,
  masterId,
  variationId,
}) => {
  return new Promise((resolve, reject) => {
    if (!isReading[readPath]) {
      let removeal = combo + title + variationId + masterId
      console.log('reading operation')
      isReading[readPath] = true

      if (!workbooks[readPath]) {
        console.log('new workbook')
        const wb = new ExcelJS.Workbook()
        wb.xlsx
          .readFile(readPath)
          .then(function () {
            workbooks[readPath] = wb
            let ws = wb.worksheets[0]
            let columnIndex

            ws.getRow(1).values.map((column, i) => {
              if (column && column === title) columnIndex = i
            })

            let column = ws.getColumn(columnIndex)
            let cellLocation = column.letter + column.values.length

            ws.getCell(cellLocation).value = combo

            wb.xlsx.writeFile(writePath).then(() => {
              isReading[readPath] = false

              console.log('done writing')
              resolve({ variationId, masterId, title, combo, removeal })

              if (saveQueue.length > 0) {
                console.log(`in queue ${saveQueue.length}`)
                saveComboToFile(saveQueue.shift())
                  .then((d) =>
                    process.send({
                      type: 'save-combo',
                      data: d.combo,
                      extra: {
                        title: d.title,
                        variationId: d.variationId,
                        masterId: d.masterId,
                        removeal: d.removeal,
                      },
                    })
                  )
                  .catch((err) =>
                    process.send({
                      type: 'error',
                      data: err,
                      extra: {
                        type: 'save-combo',
                        removeal: combo + title + variationId + masterId,
                      },
                    })
                  )
              }
            })

            if (!fs.existsSync(homeFolderPath + '/ito/backup/excel/')) {
              fs.mkdirSync(homeFolderPath + '/ito/backup/excel/', {
                recursive: true,
              })
            }

            wb.xlsx.writeFile(
              homeFolderPath +
                '/ito/backup/excel/' +
                readPath.split('/').splice(-1)[0]
            )
          })
          .catch((err) => {
            console.log('unable to read file')
            reject('unable to read file')
          })
      } else {
        console.log('workbook exist')

        const wb = workbooks[readPath]
        let ws = wb.worksheets[0]
        let columnIndex

        ws.getRow(1).values.map((column, i) => {
          if (column && column === title) columnIndex = i
        })

        let column = ws.getColumn(columnIndex)
        let cellLocation = column.letter + column.values.length

        ws.getCell(cellLocation).value = combo

        wb.xlsx.writeFile(writePath).then(() => {
          isReading[readPath] = false

          console.log('done writing')
          resolve({ variationId, masterId, title, combo, removeal })

          if (saveQueue.length > 0) {
            console.log(`in queue ${saveQueue.length}`)
            saveComboToFile(saveQueue.shift())
              .then((d) =>
                process.send({
                  type: 'save-combo',
                  data: d.combo,
                  extra: {
                    title: d.title,
                    variationId: d.variationId,
                    masterId: d.masterId,
                    removeal: d.removeal,
                  },
                })
              )
              .catch((err) =>
                process.send({
                  type: 'error',
                  data: err,
                  extra: {
                    type: 'save-combo',
                    removeal: combo + title + variationId + masterId,
                  },
                })
              )
          }
        })

        if (!fs.existsSync(homeFolderPath + '/ito/backup/excel/')) {
          fs.mkdirSync(homeFolderPath + '/ito/backup/excel/', {
            recursive: true,
          })
        }

        wb.xlsx.writeFile(
          homeFolderPath +
            '/ito/backup/excel/' +
            readPath.split('/').splice(-1)[0]
        )
      }
    } else {
      console.log('adding to queue')
      saveQueue.push({
        readPath,
        writePath,
        combo,
        title,
        homeFolderPath,
        variationId,
        masterId,
      })
    }
  })
}
