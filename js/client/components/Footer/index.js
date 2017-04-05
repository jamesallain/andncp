'use strict';

import React, {Component} from 'react';
import {createContainer} from 'react-relay';

class Footer extends Component {
  cardTitleRender() {
    return (
      <div className = 'card-title text-muted'>
        <small>
          &copy; 2017 - vip
        </small>
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
      <div className = 'Footer card'>
        {this.cardBlockRender()}
      </div>
    );
  }
}

export default createContainer(Footer, {
  fragments: {}
});
