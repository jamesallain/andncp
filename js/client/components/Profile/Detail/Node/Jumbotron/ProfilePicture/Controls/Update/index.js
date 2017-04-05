'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import ProfilePictureUpdateMutation from 'mutations/ProfilePictureUpdate';

class Update extends Component {
  state = {
    file: null
  };
  profilePictureUpdate = () => {
    this.props.relay.commitUpdate(
      new ProfilePictureUpdateMutation({
        file: this.state.file,
        node: this.props.node,
        viewer: this.props.viewer
      }),
      {
        onSuccess: () => {
          this.props.onUpdateSuccess();
        }
      }
    );
  };
  onChangeHandle = () => {
    this.setState(
      {file: this.refs.profilePictureInput.files[0]},
      () => {
        this.profilePictureUpdate();
      }
    );
  };
  render() {
    return (
      <div className = 'Update'>
        <label htmlFor = 'profilePictureInput'>
          <i className = 'fa fa-pencil btn btn-link fa-lg'></i>
        </label>
        <input
          type = 'file'
          name = 'file'
          id = 'profilePictureInput'
          ref = 'profilePictureInput'
          className = 'btn btn-link btn-lg'
          onChange = {this.onChangeHandle}
        />
      </div>
    );
  }
}

export default createContainer(Update, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Profile {
          ${ProfilePictureUpdateMutation.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${ProfilePictureUpdateMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
