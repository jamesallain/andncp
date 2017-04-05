'use strict';

import Relay, {Mutation} from 'react-relay';

export default class UserPasswordResetMutation extends Mutation {
  static fragments = {
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
        userPasswordReset
      }
    `;
  }
  getVariables() {
    return {
      email: this.props.email
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UserPasswordResetPayload @relay(pattern: true) {
        viewer
      }
    `;
  }
  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          viewer: this.props.viewer.id
        }
      }
    ];
  }
}
