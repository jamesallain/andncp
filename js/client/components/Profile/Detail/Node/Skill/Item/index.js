'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Controls from './Controls';
import Display from './Display';
import Update from './Update';

class Item extends Component {
  state = {
    updateTriggered: false
  };
  controlsRender() {
    return (!this.state.updateTriggered) &&
      <Controls
        item = {this.props.item}
        node = {this.props.node}
        viewer = {this.props.viewer}
      />;
  }
  itemRender() {
    return (!this.state.updateTriggered) ?
      <Display
        item = {this.props.item}
        node = {this.props.node}
        viewer = {this.props.viewer}
      /> :
      <Update
        item = {this.props.item}
        node = {this.props.node}
        viewer = {this.props.viewer}
      />;
  }
  render() {
    return (
      <div className = {`Item ${(this.props.lastChild) ? 'lastChild' : ''}`}>
        {this.controlsRender()}
        {this.itemRender()}
      </div>
    );
  }
}

export default createContainer(Item, {
  fragments: {
    item() {
      return Relay.QL`
        fragment on Skill {
          ${Controls.getFragment('item')},
          ${Display.getFragment('item')},
          ${Update.getFragment('item')}
        }
      `;
    },
    node() {
      return Relay.QL`
        fragment on Profile {
          ${Controls.getFragment('node')},
          ${Display.getFragment('node')},
          ${Update.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${Controls.getFragment('viewer')},
          ${Display.getFragment('viewer')},
          ${Update.getFragment('viewer')}
        }
      `;
    }
  }
});
