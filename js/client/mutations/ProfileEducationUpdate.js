'use strict';

import Relay, {Mutation} from 'react-relay';

export default class ProfileEducationUpdateMutation extends Mutation {
  static fragments = {
    item() {
      return Relay.QL`
        fragment on Education {
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
        profileEducationUpdate
      }
    `;
  }
  getVariables() {
    return {
      id: this.props.node.id,
      educationId: this.props.item.id,
      date: this.props.date,
      degree: this.props.degree,
      title: this.props.title
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ProfileEducationUpdatePayload @relay(pattern: true) {
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
