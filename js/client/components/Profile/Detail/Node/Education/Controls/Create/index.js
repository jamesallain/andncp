'use strict';

import React, {Component} from 'react';
import {createContainer} from 'react-relay';

class Create extends Component {
  render() {
    return (
      <button
        className = 'btn btn-outline-primary'
        onClick = {this.props.onCreateTrigger}
      >
        <i className = 'fa fa-plus'></i>
      </button>
    );
  }
}

export default createContainer(Create, {
  fragments: {}
});
