'use strict';

import Relay, {Mutation} from 'react-relay';

export default class ProfileExperienceDeleteMutation extends Mutation {
  static fragments = {
    item() {
      return Relay.QL`
        fragment on Experience {
          id
        }
      `;
    },
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
        profileExperienceDelete
      }
    `;
  }
  getVariables() {
    return {
      id: this.props.node.id,
      experienceId: this.props.item.id
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ProfileExperienceDeletePayload @relay(pattern: true) {
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
