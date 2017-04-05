'use strict';

import Relay, {Mutation} from 'react-relay';

export default class UserUpdateMutation extends Mutation {
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
        userUpdate
      }
    `;
  }
  getVariables() {
    return {
      id: this.props.user.id,
      email: this.props.email,
      password: this.props.password
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UserUpdatePayload @relay(pattern: true) {
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
          field: this.props.user.id,
          viewer: this.props.viewer.id
        }
      }
    ];
  }
}
