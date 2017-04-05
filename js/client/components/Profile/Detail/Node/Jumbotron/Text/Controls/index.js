'use strict';

import React, {Component} from 'react';
import {createContainer} from 'react-relay';

import Update from './Update';

class Controls extends Component {
  updateRender() {
    return (
      <Update
        onUpdateTrigger = {this.props.onUpdateTrigger}
      />
    );
  }
  render() {
    return (
      <div className = 'Controls float-right'>
        {this.updateRender()}
      </div>
    );
  }
}

export default createContainer(Controls, {
  fragments: {}
});
