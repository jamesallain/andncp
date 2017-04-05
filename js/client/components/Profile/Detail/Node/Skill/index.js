'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Create from './Create';
import Item from './Item';
import Controls from './Controls';

class Skill extends Component {
  state = {
    createRequired: createRequiredGet(this.props),
    createTriggered: false
  };
  componentWillReceiveProps(nextProps) {
    this.setState({createRequired: createRequiredGet(nextProps)});
  }
  onCreateTriggerHandle = () => {
    this.setState({createTriggered: true});
  };
  onCreateCancelHandle = () => {
    this.setState({createTriggered: false});
  };
  onCreateSuccesHandle = () => {
    this.setState({
      createRequired: false,
      createTriggered: false
    });
  };
  createRender() {
    return ((this.state.createRequired ||
      this.state.createTriggered)) &&
      <Create
        node = {this.props.node}
        viewer = {this.props.viewer}
        createRequired = {this.state.createRequired}
        createTriggered = {this.state.createTriggered}
        onCreateSucces = {this.onCreateSuccesHandle}
        onCreateCancel = {this.onCreateCancelHandle}
      />;
  }
  itemsRender() {
    return this.props.node.skills.reduce((memo, item, index) => {
      return [
        ...memo,
        <Item
          key = {index}
          item = {item}
          node = {this.props.node}
          viewer = {this.props.viewer}
          lastChild = {
            (index === this.props.node.skills.length - 1) ?
              true :
              false
          }
        />
      ];
    }, []);
  }
  controlsRender() {
    return (!this.state.createRequired &&
      !this.state.createTriggered) &&
      <Controls
        onCreateTrigger = {this.onCreateTriggerHandle}
      />;
  }
  render() {
    return (
      <div className = 'Skill'>
        <h6>Skill</h6>

        {
          (!!this.props.node.skills.length) &&
            <hr/>
        }

        {this.createRender()}
        {this.itemsRender()}
        {this.controlsRender()}
        <br/>
      </div>
    );
  }
}

export default createContainer(Skill, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Profile {
          skills {
            ${Item.getFragment('item')}
          },
          ${Create.getFragment('node')},
          ${Item.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${Create.getFragment('viewer')},
          ${Item.getFragment('viewer')}
        }
      `;
    }
  }
});

const createRequiredGet = (props) => {
  return (props.node.skills.length) ?
    false :
    true;
};
