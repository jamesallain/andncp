'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Controls from './Controls';
import Display from './Display';
import Update from './Update';

class Item extends Component {
  state = {
    updateTriggered: this.props.updateTriggered
  };
  componentWillReceiveProps(nextProps) {
    this.setState({updateTriggered: nextProps.updateTriggered});
  }
  onUpdateTriggerHandle = () => {
    this.setState(
      {updateTriggered: true},
      () => {
        this.props.onUpdateTrigger(this.props.item.id);
      }
    );
  };
  onUpdateSuccessHandle = () => {
    this.setState({updateTriggered: false});
  };
  onUpdateCancelHandle = () => {
    this.setState({updateTriggered: false});
  };
  controlsRender() {
    return (!this.state.updateTriggered) &&
      <Controls
        item = {this.props.item}
        node = {this.props.node}
        viewer = {this.props.viewer}
        onUpdateTrigger = {this.onUpdateTriggerHandle}
      />;
  }
  itemRender() {
    return (!this.state.updateTriggered) ?
      <Display
        item = {this.props.item}
      /> :
      <Update
        item = {this.props.item}
        node = {this.props.node}
        viewer = {this.props.viewer}
        onUpdateSuccess = {this.onUpdateSuccessHandle}
        onUpdateCancel = {this.onUpdateCancelHandle}
      />;
  }
  render() {
    return (
      <div className = {`Item ${(this.props.lastChild) && 'lastChild'}`}>
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
        fragment on Experience {
          id,
          ${Display.getFragment('item')},
          ${Update.getFragment('item')},
          ${Controls.getFragment('item')}
        }
      `;
    },
    node() {
      return Relay.QL`
        fragment on Profile {
          ${Update.getFragment('node')},
          ${Controls.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${Update.getFragment('viewer')},
          ${Controls.getFragment('viewer')}
        }
      `;
    }
  }
});
