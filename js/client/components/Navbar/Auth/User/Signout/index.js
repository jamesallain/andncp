'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';
import {browserHistory} from 'react-router';

import UserSignoutMutation from 'mutations/UserSignout';

class Signout extends Component {
  state = {};
  onClickHandle = (evnt) => {
    evnt.preventDefault();
    evnt.stopPropagation();

    this.props.relay.commitUpdate(
      new UserSignoutMutation({
        viewer: this.props.viewer
      }),
      {
        onSuccess: () => {
          browserHistory.push('/Auth#Signin');
        }
      }
    );
  };
  render() {
    return (
      <li className = 'nav-item'>
        <a
          className = 'nav-link'
          href = '#'
          onClick = {this.onClickHandle}
        >
          Signout
        </a>
      </li>
    );
  }
}

export default createContainer(Signout, {
  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${UserSignoutMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
