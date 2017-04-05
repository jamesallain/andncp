'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

class Display extends Component {
  cardTitleRender() {
    return (
      <div className = 'card-title'>
        <h6 className = ''>
          {this.props.item.company}
        </h6>
        <h6 className = 'text-muted'>
          {this.props.item.title}
        </h6>
        <small className = 'text-muted'>
          {this.props.item.region}
          &nbsp;
          -
          &nbsp;
          {this.props.item.country}
        </small>
        <br/>
        <small className = 'text-muted'>
          {this.props.item.since}
          &nbsp;
          <small className = 'text-muted'> - </small>
          &nbsp;
          {this.props.item.until}
        </small>
      </div>
    );
  }
  cardTextRender() {
    return (
      <small className = 'card-text text-muted'>
        {this.props.item.description}
      </small>
    );
  }
  cardBlockRender() {
    return (
      <div className = 'card-block'>
        {this.cardTitleRender()}
        {this.cardTextRender()}
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
        fragment on Experience {
          company,
          description,
          region,
          country,
          since,
          title,
          until
        }
      `;
    },
  }
});
