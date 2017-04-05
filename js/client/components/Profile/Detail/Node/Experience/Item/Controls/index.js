'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Update from './Update';
import Delete from './Delete';

class Controls extends Component {
  updateRender() {
    return (
      <Update
        item = {this.props.item}
        node = {this.props.node}
        viewer = {this.props.viewer}
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
  render(){
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
        fragment on Experience {
          ${Update.getFragment('item')},
          ${Delete.getFragment('item')}
        }
      `;
    },
    node() {
      return Relay.QL`
        fragment on Profile {
          ${Update.getFragment('node')},
          ${Delete.getFragment('node')}
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
