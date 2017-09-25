import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom'
import {Provider} from 'react-redux'

// utils
import alertify from 'alertifyjs'
import formatMoney from '../utils/formatMoney.js'

// layout components

import TopBar from './layout/topBar/topBar.jsx'
import SideMenu from './layout/sideMenu/sideMenu.jsx'

// Store
import store from './store.js'
// Routes

window.alertify = alertify
formatMoney()

ReactDOM.render(
  <Provider store={store}>

    <Router>
      <div >
        <SideMenu />
        <div id='mainContainer' className='blur-div mainContainer'>
          <TopBar />

        </div>
      </div>
    </Router>

  </Provider>, document.getElementById('app-container'))
