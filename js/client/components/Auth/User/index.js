'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Update from './Update';
import Delete from './Delete';

class User extends Component {
  updateRender() {
    return (
      <Update
        user = {this.props.user}
        viewer = {this.props.viewer}
      />
    );
  }
  deleteRender() {
    return (
      <Delete
        user = {this.props.user}
        viewer = {this.props.viewer}
      />
    );
  }
  render() {
    return (
      <div className = 'User'>
        {this.updateRender()}
        <hr/>
        {this.deleteRender()}
      </div>
    );
  }
}

export default createContainer(User, {
  fragments: {
    user() {
      return Relay.QL`
        fragment on User {
          ${Update.getFragment('user')},
          ${Delete.getFragment('user')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${Update.getFragment('viewer')},
          ${Delete.getFragment('viewer')}
        }
      `;
    }
  }
});
