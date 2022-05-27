import React from "react"
// import { createRoot } from "react-dom/client"

import { Provider } from "react-redux"
import { createStore, applyMiddleware } from "redux"

import { createStateSyncMiddleware, initMessageListener } from "redux-state-sync"

import reducers from "./reducers"

import App from "./App"
import reportWebVitals from "./reportWebVitals"

export const store = createStore(reducers, applyMiddleware(createStateSyncMiddleware()))

window.store = store
import ReactDOM from "react-dom"

initMessageListener(store)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
)
export default store

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
