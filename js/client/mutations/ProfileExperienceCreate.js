'use strict';

import Relay, {Mutation} from 'react-relay';

export default class ProfileExperienceCreateMutation extends Mutation {
  static fragments = {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
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
    }
  };
  getMutation() {
    return Relay.QL`
      mutation {
        profileExperienceCreate
      }
    `;
  }
  getVariables() {
    return {
      id: this.props.node.id,
      company: this.props.company,
      title: this.props.title,
      country: this.props.country,
      region: this.props.region,
      since: this.props.since,
      until: this.props.until,
      description: this.props.description
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ProfileExperienceCreatePayload @relay(pattern: true) {
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
