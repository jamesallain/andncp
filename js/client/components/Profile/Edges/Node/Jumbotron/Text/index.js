'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

class Text extends Component {
  textRender() {
    return (
      <div>
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
  render() {
    return (
      <div className = 'Text text-center text-muted'>
        {this.textRender()}
      </div>
    );
  }
}

export default createContainer(Text, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Profile {
          fullName,
          title,
          currentCompany,
          country,
          region,
          educationTitle
        }
      `;
    }
  }
});
