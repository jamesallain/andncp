'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

class Display extends Component {
  cardTitleRender() {
    return (
      <div className = 'card-title'>
        <h7 className = 'text-muted'>
          {this.props.item.date}
        </h7>
        <br/>
        <h7>
          {this.props.item.degree}
        </h7>
        <br/>
        <h7 className = 'text-muted'>
          {this.props.item.title}
        </h7>
        <br/>
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
        fragment on Education {
          date,
          degree,
          major,
          title
        }
      `;
    }
  }
});
