import { HashRouter, Route } from 'react-router-dom'

import './sass/main.scss'

import Header from './components/fram/Header'
import Dashboard from './components/windows/Dashboard'
import UniSummary from './components/windows/UniSummary'

const App = () => {
  return (
    <HashRouter>
      <div className="App__main">
        <Route path="/" component={Header} />
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/unisummary" exact component={UniSummary} />
      </div>
    </HashRouter>
  )
}

export default App
