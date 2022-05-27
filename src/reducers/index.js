import { combineReducers } from "redux"
// import { reducer as formReducer } from "redux-form"

import isOpenReducer from "./main/isOpenReducer"
import settingsReducer from "./main/settingsReducer"

import uniReducer from "./uniReducer"

export default combineReducers({
  isOpen: isOpenReducer,
  // results: resultsReducer,
  settings: settingsReducer,

  unis: uniReducer,
  // uniVariations: uniVariations,
})
