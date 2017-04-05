'use strict';

import Relay, {Mutation} from 'react-relay';

export default class UserSignoutMutation extends Mutation {
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
        userSignout
      }
    `;
  }
  getVariables() {
    return {};
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UserSignoutPayload @relay(pattern: true) {
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
