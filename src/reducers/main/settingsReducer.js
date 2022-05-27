import { UPDATESETTINGS } from '../../actions/types'
const { app } = require('@electron/remote')

const Store = require('electron-store')
const settingsStore = new Store({ name: 'settings' })

let data
let getData = () => {
  if (!data) {
    data = settingsStore.get('settings')
    if (!data) {
      data = { autoSave: false, homeFolder: app.getPath('desktop').replaceAll('\\','/') }
      settingsStore.set('settings', data)
    }
    else if (Object.keys(data).length === 0) {
      data = { autoSave: false, homeFolder: app.getPath('desktop').replaceAll('\\','/') }
      settingsStore.set('settings', data)
    }

  }
  return data
}

const settingsReducer = (state = getData(), action) => {
  if (action.type === UPDATESETTINGS) {
    settingsStore.set('settings', { ...state, ...action.payload.data })
    return { ...state, ...action.payload.data }
  }
  return state
}

export default settingsReducer
