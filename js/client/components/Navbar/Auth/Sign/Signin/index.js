'use strict';

import React, {Component} from 'react';
import {createContainer} from 'react-relay';
import {Link} from 'react-router';

class Signin extends Component {
  render() {
    return (
      <li className = 'nav-item'>
        <Link
          className = 'nav-link'
          to = '/Auth#Signin'
        >
          Signin
        </Link>
      </li>
    );
  }
}

export default createContainer(Signin, {
  fragments: {}
});
