'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

class Update extends Component {
  render() {
    return (
      <div className = 'Update'>
        Update
      </div>
    );
  }
}

export default createContainer(Update, {
  fragments: {
    item() {
      return Relay.QL`
        fragment on Skill {
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
  }
});
