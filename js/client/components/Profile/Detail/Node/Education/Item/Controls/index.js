'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Update from './Update';
import Delete from './Delete';

class Controls extends Component {
  updateRender() {
    return (
      <Update
        onUpdateTrigger = {this.props.onUpdateTrigger}
      />
    );
  }
  deleteRender() {
    return (
      <Delete
        item = {this.props.item}
        node = {this.props.node}
        viewer = {this.props.viewer}
      />
    );
  }
  render() {
    return (
      <div className = 'Controls'>
        {this.updateRender()}
        <br/>
        {this.deleteRender()}
      </div>
    );
  }
}

export default createContainer(Controls, {
  fragments: {
    item() {
      return Relay.QL`
        fragment on Education {
          ${Delete.getFragment('item')}
        }
      `;
    },
    node() {
      return Relay.QL`
        fragment on Profile {
          ${Delete.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${Delete.getFragment('viewer')}
        }
      `;
    }
  }
});
