'use strict';

import React, {Component, cloneElement} from 'react';
import Relay, {createContainer} from 'react-relay';

import Edges from './Edges';
import Detail from './Detail';

class Profile extends Component {
  render() {
    return (
      <div className = 'Profile'>
        {
          cloneElement(
            this.props.children,
            {
              viewer: this.props.viewer,
              searchTermInput: this.props.searchTermInput
            }
          )
        }
      </div>
    );
  }
}

export default createContainer(Profile, {
  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${Edges.getFragment('viewer')},
          ${Detail.getFragment('viewer')}
        }
      `;
    }
  }
});
