'use strict';

import Relay, {Mutation} from 'react-relay';

export default class UserDeleteMutation extends Mutation {
  static fragments = {
    user() {
      return Relay.QL`
        fragment on User {
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
        userDelete
      }
    `;
  }
  getVariables() {
    return {
      id: this.props.user.id
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UserDeletePayload @relay(pattern: true) {
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
          field: this.props.user.id
        }
      }
    ];
  }
}
