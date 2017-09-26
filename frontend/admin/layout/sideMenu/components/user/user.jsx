/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {fecthProfile} from '../../../../profile/actions'

@connect((store) => {
  return {
    user: store.profile.user,
    profile: store.profile.profile
  }
})
export default class User extends React.Component {
  componentWillMount() {
    this.props.dispatch(fecthProfile())
  }
  // Main Layout
  render() {

    const name = this.props.user.first_name ? this.props.user.first_name : 'Administrador'
    const lastName = this.props.user.last_name ? this.props.user.last_name : 'Sistema'
    const avatar = this.props.profile.avatar ? `/media/${this.props.profile.avatar}` : '/media/profile.jpg'

    return <div className='sideMenu-user col-xs-12 '>

      <div className='sideMenu-user-avatar'>
        <img src={avatar} />
      </div>

      <div className='sideMenu-user-name'>
        <span>{`${name} ${lastName}`}</span>
        <hr />
      </div>

      <div className='sideMenu-user-lock'>
        <span className='fa fa-lock' />
      </div>
    </div>

  }

}
