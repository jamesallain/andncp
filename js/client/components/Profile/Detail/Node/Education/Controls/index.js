'use strict';

import React, {Component} from 'react';
import {createContainer} from 'react-relay';

import Create from './Create';

class Controls extends Component {
  createRender() {
    return (
      <Create
        onCreateTrigger = {this.props.onCreateTrigger}
      />
    );
  }
  render() {
    return (
      <div className = 'Controls'>
        {this.createRender()}
      </div>
    );
  }
}

export default createContainer(Controls, {
  fragments: {}
});
