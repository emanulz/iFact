import { combineReducers } from 'redux'

import sideMenu from './layout/sideMenu/reducer.js'
import profile from './profile/reducer.js'

export default combineReducers({
  sideMenu,
  profile
})
