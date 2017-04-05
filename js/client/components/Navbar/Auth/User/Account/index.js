'use strict';

import React, {Component} from 'react';
import {createContainer} from 'react-relay';
import {Link} from 'react-router';

class Account extends Component {
  render() {
    return (
      <il className = 'nav-item'>
        <Link
          className = 'nav-link'
          to = '/Auth#Account'
        >
          Account
        </Link>
      </il>
    );
  }
}

export default createContainer(Account, {
  fragments: {}
});
