'use strict';

import React, {Component, cloneElement} from 'react';
import Relay, {createContainer} from 'react-relay';

import styles from './styles.css';
import Navbar from './Navbar';
import Profile from './Profile';
import Auth from './Auth';
import Footer from './Footer';

class Viewer extends Component {
  state = {
    searchTermInput: null
  };
  onSeachTermInputTriggerHandle = (searchTermInput) => {
    this.setState({searchTermInput});
  };
  render() {
    return (
      <div
        className = {`${styles.Viewer}`}
      >
        <Navbar
          viewer = {this.props.viewer}
          onSeachTermInputTrigger = {this.onSeachTermInputTriggerHandle}
        />
        <div className = 'container-fluid'>
          {
            cloneElement(
              this.props.children,
              {
                viewer: this.props.viewer,
                searchTermInput: this.state.searchTermInput
              }
            )
          }
        </div>

        <Footer/>
      </div>
    );
  }
}

export default createContainer(Viewer, {
  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${Navbar.getFragment('viewer')},
          ${Profile.getFragment('viewer')},
          ${Auth.getFragment('viewer')}
        }
      `;
    }
  }
});
