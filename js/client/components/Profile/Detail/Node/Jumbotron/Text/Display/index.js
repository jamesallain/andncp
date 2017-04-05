'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

class Display extends Component {
  render() {
    return (
      <div className = 'Display'>
        <h4>{this.props.node.fullName}</h4>
        <h6>{this.props.node.title}</h6>
        <p>
          {
            this.props.node.currentCompany
          }
          &nbsp;
          |
          &nbsp;
          {
            this.props.node.educationTitle
          }
        </p>
        <small>{`${this.props.node.country}, ${this.props.node.region}`}</small>
      </div>
    );
  }
}

export default createContainer(Display, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Profile {
          fullName,
          title,
          currentCompany,
          educationTitle,
          country,
          region
        }
      `;
    }
  }
});
