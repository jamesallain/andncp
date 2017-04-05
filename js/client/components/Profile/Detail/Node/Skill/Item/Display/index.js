'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

class Display extends Component {
  cardTitleRender() {
    return (
      <div className = 'card-title'>
        <h6 className = 'text-muted'>
          {this.props.item.name}
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
  cardRender() {
    return (
      <div className = 'card'>
        {this.cardBlockRender()}
      </div>
    );
  }
  render() {
    return (
      <div className = 'Display'>
        {this.cardRender()}
      </div>
    );
  }
}

export default createContainer(Display, {
  fragments: {
    item() {
      return Relay.QL`
        fragment on Skill {
          name
        }
      `;
    },
    node() {
      return Relay.QL`
        fragment on Profile {
          id
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          id
        }
      `;
    }
  }
});
