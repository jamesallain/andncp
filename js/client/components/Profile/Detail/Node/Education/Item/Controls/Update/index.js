'use strict';

import React, {Component} from 'react';
import {createContainer} from 'react-relay';

class Update extends Component {
  render() {
    return (
      <button
        className = 'btn btn-link btn-sm'
        onClick = {this.props.onUpdateTrigger}
      >
        <i className = 'fa fa-pencil'></i>
      </button>
    );
  }
}

export default createContainer(Update, {
  fragments: {}
});
