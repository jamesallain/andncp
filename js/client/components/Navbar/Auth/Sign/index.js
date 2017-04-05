'use strict';

import React, {Component} from 'react';
import {createContainer} from 'react-relay';

import Signin from './Signin';

class Sign extends Component {
  signinRender() {
    return (
      <Signin/>
    );
  }
  render() {
    return (
      <ul className = 'navbar-nav'>
        {this.signinRender()}
      </ul>
    );
  }
}

export default createContainer(Sign, {
  fragments: {}
});
