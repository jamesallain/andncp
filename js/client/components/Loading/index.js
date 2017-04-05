'use strict';

import React, {Component} from 'react';
import {createContainer} from 'react-relay';

class Loading extends Component {
  cardTitleRender() {
    return (
      <div className = 'card-text text-muted text-center'>
        <h6 className = 'Loading'>
          <i className = 'fa fa-circle-o-notch fa-spin'></i>
          &nbsp;
          Loading
        </h6>
      </div>
    );
  }
  cardBlockRender() {
    return (
      <div className = 'card-block'>
        {this.cardTitleRender()}
      </div>
    );
  }
  render() {
    return (
      <div className = 'Loading card col-4 offset-4'>
        {this.cardBlockRender()}
      </div>
    );
  }
}

export default createContainer(Loading, {
  fragments: {}
});
