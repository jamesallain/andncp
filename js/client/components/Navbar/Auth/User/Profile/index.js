'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';
import {Link} from 'react-router';

class Profile extends Component {
  render() {
    return (
      <li className = 'nav-item'>
        <Link
          className = 'nav-link'
          to = {`/Profile/${this.props.user.profileId}`}
        >
          Profile
        </Link>
      </li>
    );
  }
}

export default createContainer(Profile, {
  fragments: {
    user() {
      return Relay.QL`
        fragment on User {
          profileId
        }
      `;
    }
  }
});
