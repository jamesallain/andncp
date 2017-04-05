'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import ProfilePicture from './ProfilePicture';
import Text from './Text';

class Jumbotron extends Component {
  profilePictureRender() {
    return (
      <ProfilePicture
        node = {this.props.node}
        viewer = {this.props.viewer}
      />
    );
  }
  textRender() {
    return (
      <Text
        node = {this.props.node}
        isCreator = {this.props.isCreator}
        viewer = {this.props.viewer}
      />
    );
  }
  render() {
    return (
      <div className = 'Jumbotron jumbotron'>
        {this.profilePictureRender()}
        <br/>
        {this.textRender()}
      </div>
    );
  }
}

export default createContainer(Jumbotron, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Profile {
          ${ProfilePicture.getFragment('node')},
          ${Text.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${Text.getFragment('viewer')},
          ${ProfilePicture.getFragment('viewer')}
        }
      `;
    }
  }
});
