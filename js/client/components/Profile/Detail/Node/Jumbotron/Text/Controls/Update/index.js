'use strict';

import React, {Component} from 'react';
import {createContainer} from 'react-relay';

class Update extends Component {
  render() {
    return (
      <button
        className = 'btn btn-link'
        onClick = {this.props.onUpdateTrigger}
      >
        <i className = 'fa fa-pencil fa-lg'></i>
      </button>
    );
  }
}

export default createContainer(Update, {
  fragments: {}
});
