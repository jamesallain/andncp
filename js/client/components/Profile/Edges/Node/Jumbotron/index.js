'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Text from './Text';

class Jumbotron extends Component {
  textRender() {
    return (
      <Text
        node = {this.props.node}
      />
    );
  }
  render() {
    return (
      <div className = 'Jumbotron card'>
        {this.textRender()}
      </div>
    );
  }
}

export default createContainer(Jumbotron, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Profile {
          ${Text.getFragment('node')}
        }
      `;
    }
  }
});
