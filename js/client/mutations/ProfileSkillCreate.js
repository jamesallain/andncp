'use strict';

import Relay, {Mutation} from 'react-relay';

export default class ProfileSkillCreateMutation extends Mutation {
  static fragments = {
    node() {
      return Relay.QL`
        fragment on Profile {
          id
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          id
        }
      `;
    }
  };
  getMutation() {
    return Relay.QL`
      mutation {
        profileSkillCreate
      }
    `;
  }
  getVariables() {
    return {
      id: this.props.node.id,
      name: this.props.name
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ProfileSkillCreatePayload @relay(pattern: true) {
        viewer,
        field
      }
    `;
  }
  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          viewer: this.props.viewer.id,
          field: this.props.node.id
        }
      }
    ];
  }
}
