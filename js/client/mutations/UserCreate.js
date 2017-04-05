'use strict';

import Relay, {Mutation} from 'react-relay';

export default class UserCreateMutation extends Mutation {
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
        userCreate
      }
    `;
  }
  getVariables() {
    return {
      email: this.props.email,
      password: this.props.password
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UserCreatePayload @relay(pattern: true) {
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
