'use strict';

import React, {Component} from 'react';
import {createContainer} from 'react-relay';

class Empty extends Component {
  render() {
    return (
      <div className = 'Empty jumbotron text-muted text-center'>
        <h4>No Results ...</h4>
      </div>
    );
  }
}

export default createContainer(Empty, {
  fragments: {}
});
