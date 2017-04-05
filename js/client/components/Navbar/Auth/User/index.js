'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Profile from './Profile';
import Signout from './Signout';
import Account from './Account';

class User extends Component {
  profileRender() {
    return (
      <Profile
        user = {this.props.viewer.user}
      />
    );
  }
  accountRender() {
    return (
      <Account/>
    );
  }
  signoutRender() {
    return (
      <Signout
        viewer = {this.props.viewer}
      />
    );
  }
  render() {
    return (
      <ul className = 'navbar-nav'>
        {this.profileRender()}
        {this.accountRender()}
        {this.signoutRender()}
      </ul>
    );
  }
}

export default createContainer(User, {
  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          user {
            ${Profile.getFragment('user')}
          },
          ${Signout.getFragment('viewer')}
        }
      `;
    }
  }
});
