'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';
import {Link} from 'react-router';

import Jumbotron from './Jumbotron';

class Node extends Component {
  jumbotronRender() {
    return (
      <Jumbotron
        node = {this.props.node}
      />
    );
  }
  linkRender() {
    return (
      <Link
        to = {`/Profile/${this.props.node.id}`}
        style = {{
          textDecoration: 'none'
        }}
      >
        {this.jumbotronRender()}
      </Link>
    );
  }
  render() {
    return (
      <div
        className = 'Node'
      >
        {this.linkRender()}
      </div>
    );
  }
}

export default createContainer(Node, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Profile {
          id,
          ${Jumbotron.getFragment('node')}
        }
      `;
    }
  }
});
