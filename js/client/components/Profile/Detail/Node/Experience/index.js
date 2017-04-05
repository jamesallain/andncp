'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Item from './Item';
import Controls from './Controls';
import Create from './Create';

class Experience extends Component {
  state = {
    createRequired: createRequiredGet(this.props),
    createTriggered: false,
    experienceActiveId: null
  };
  componentWillReceiveProps(nextProps) {
    this.setState({
      createRequired: createRequiredGet(nextProps)
    });
  }
  onUpdateTriggerHandle = (experienceId) => {
    this.setState({
      experienceActiveId: experienceId
    });
  };
  itemsRender() {
    return this.props.node.experiences.reduce((memo, item, index) => {
      return [
        ...memo,
        <Item
          key = {index}
          item = {item}
          node = {this.props.node}
          viewer = {this.props.viewer}
          lastChild = {
            (index === this.props.node.experiences.length - 1) ?
              true :
              false
          }
          onUpdateTrigger = {this.onUpdateTriggerHandle}
          updateTriggered = {
            (this.state.experienceActiveId &&
             this.state.experienceActiveId.toString() === item.id.toString()) ?
              true :
              false
          }
        />
      ];
    }, []);
  }
  onCreateTriggerHandle = () => {
    this.setState({createTriggered: true});
  };
  onCreateSuccesHandle = () => {
    this.setState({
      createRequired: false,
      createTriggered: false
    });
  };
  onCreateCancelHandle = () => {
    this.setState({createTriggered: false});
  };
  controlsRender() {
    return (!this.state.createRequired &&
      !this.state.createTriggered) &&
     <Controls
      onCreateTrigger = {this.onCreateTriggerHandle}
     />;
  }
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
  render() {
    return (
      <div className = 'Experience'>
        <h6>Experience</h6>

        {
          (!!this.props.node.experiences.length) &&
            <hr/>
        }

        {this.createRender()}
        {this.itemsRender()}
        {this.controlsRender()}
      </div>
    );
  }
}

export default createContainer(Experience, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Profile {
          experiences {
            id,
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
  return (props.node.experiences.length) ?
    false :
    true;
};
