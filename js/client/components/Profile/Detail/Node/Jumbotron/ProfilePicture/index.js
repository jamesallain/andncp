'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Display from './Display';
import Controls from './Controls';

class ProfilePicture extends Component {
  state = {
    updateSuccess: false
  };
  onUpdateSuccessHandle = () => {
    this.setState(
      {updateSuccess: true},
      () => {
        this.setState({updateSuccess: false});
      }
    );
  };
  displayRender() {
    return (
      <Display
        node = {this.props.node}
        updateSuccess = {this.state.updateSuccess}
      />
    );
  }
  controlsRender() {
    return (
      <Controls
        node = {this.props.node}
        viewer = {this.props.viewer}
        onUpdateSuccess = {this.onUpdateSuccessHandle}
      />
    );
  }
  render() {
    return (
      <div className = 'ProfilePicture text-center'>
        {this.displayRender()}
        {this.controlsRender()}
      </div>
    );
  }
}

export default createContainer(ProfilePicture, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Profile {
          ${Display.getFragment('node')},
          ${Controls.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${Controls.getFragment('viewer')}
        }
      `;
    }
  }
});
