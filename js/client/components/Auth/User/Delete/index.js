'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';
import {browserHistory} from 'react-router';

import UserDeleteMutation from 'mutations/UserDelete';

class Delete extends Component {
  state = {};
  userDelete = () => {
    this.props.relay.commitUpdate(
      new UserDeleteMutation({
        user: this.props.user,
        viewer: this.props.viewer
      }),
      {
        onFailure: (transaction) => {
          const err = transaction.getError().source.errors[0].message;
          console.log(err);
        },
        onSuccess: () => {
          browserHistory.push('/Profile/Edges');
        }
      }
    );
  };
  onClickHandle = () => {
    this.userDelete();
  };
  deleteRender() {
    return (
      <button
        className = 'btn btn-outline-danger'
        onClick = {this.onClickHandle}
      >
        Delete
      </button>
    );
  }
  messageRender() {
    return (
      <p>
        Once you delete a account, there is no going back. Please be certain.
      </p>
    );
  }
  render() {
    return (
      <div className = 'Delete'>
        {this.messageRender()}
        {this.deleteRender()}
      </div>
    );
  }
}

export default createContainer(Delete, {
  fragments: {
    user() {
      return Relay.QL`
        fragment on User {
          ${UserDeleteMutation.getFragment('user')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${UserDeleteMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
