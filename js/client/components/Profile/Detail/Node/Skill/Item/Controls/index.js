'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Delete from './Delete';

class Controls extends Component {
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
        {this.deleteRender()}
      </div>
    );
  }
}

export default createContainer(Controls, {
  fragments: {
    item() {
      return Relay.QL`
        fragment on Skill {
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
