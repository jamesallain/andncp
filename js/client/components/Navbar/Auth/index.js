'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Sign from './Sign';
import User from './User';

class Auth extends Component {
  authRender() {
    return (!this.props.viewer.user.email) ?
     <Sign/> :
     <User
      viewer = {this.props.viewer}
     />;
  }
  render() {
    return (
      <div className = 'Auth'>
        {this.authRender()}
      </div>
    );
  }
}

export default createContainer(Auth, {
  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          user {
            email
          },
          ${User.getFragment('viewer')}
        }
      `;
    }
  }
});
