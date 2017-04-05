'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Update from './Update';

class Controls extends Component {
  updateRender() {
    return (
      <Update
        node = {this.props.node}
        viewer = {this.props.viewer}
        onUpdateSuccess = {this.props.onUpdateSuccess}
      />
    );
  }
  render() {
    return (
      <div className = 'Controls'>
        {this.updateRender()}
      </div>
    );
  }
}

export default createContainer(Controls, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Profile {
          ${Update.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${Update.getFragment('viewer')}
        }
      `;
    }
  }
});
