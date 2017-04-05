'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import ProfileExperienceDeleteMutation from 'mutations/ProfileExperienceDelete';

class Delete extends Component {
  state = {};
  profileExperienceDelete = () => {
    this.props.relay.commitUpdate(
      new ProfileExperienceDeleteMutation({
        item: this.props.item,
        node: this.props.node,
        viewer: this.props.viewer
      })
    );
  };
  onClickHandle = () => {
    this.profileExperienceDelete();
  };
  render() {
    return (
      <button
        className = 'Delete btn btn-link btn-sm'
        onClick = {this.onClickHandle}
      >
        <i className = 'fa fa-times'></i>
      </button>
    );
  }
}

export default createContainer(Delete, {
  fragments: {
    item() {
      return Relay.QL`
        fragment on Experience {
          ${ProfileExperienceDeleteMutation.getFragment('item')}
        }
      `;
    },
    node() {
      return Relay.QL`
        fragment on Profile {
          ${ProfileExperienceDeleteMutation.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${ProfileExperienceDeleteMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
