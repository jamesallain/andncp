'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import ProfileSkillDeleteMutation from 'mutations/ProfileSkillDelete';

class Delete extends Component {
  state = {};
  profileSkillDelete = () => {
    this.props.relay.commitUpdate(
      new ProfileSkillDeleteMutation({
        item: this.props.item,
        node: this.props.node,
        viewer: this.props.viewer
      })
    );
  };
  onClickHandle = () => {
    this.profileSkillDelete();
  };
  render() {
    return (
      <button
        className = 'btn btn-link btn-sm'
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
        fragment on Skill {
          ${ProfileSkillDeleteMutation.getFragment('item')}
        }
      `;
    },
    node() {
      return Relay.QL`
        fragment on Profile {
          ${ProfileSkillDeleteMutation.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${ProfileSkillDeleteMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
