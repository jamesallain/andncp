'use strict';

import Relay, {Mutation} from 'react-relay';

export default class ProfileExperienceUpdateMutation extends Mutation {
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
        profileExperienceUpdate
      }
    `;
  }
  getVariables() {
    return {
      id: this.props.node.id,
      experienceId: this.props.item.id,
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
      fragment on ProfileExperienceUpdatePayload @relay(pattern: true) {
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
