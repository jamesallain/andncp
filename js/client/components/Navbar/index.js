'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';
import {browserHistory} from 'react-router';

import Auth from './Auth';

class Navbar extends Component {
  state = {};
  onSearchTermSubmit = (evnt) => {
    evnt.preventDefault();
    evnt.stopPropagation();

    browserHistory.push('/');
    setTimeout(() => {
      this.props.onSeachTermInputTrigger(this.refs.searchTermInput.value);
    }, 0);

  };
  authRender() {
    return (
      <Auth
        viewer = {this.props.viewer}
      />
    );
  }
  render() {
    return (
        <nav className="navbar navbar-toggleable-md navbar-light bg-faded fixed-top">
          <button
            className="navbar-toggler navbar-toggler-right"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <a
            className="navbar-brand"
            href="/"
          >
            vip
          </a>

          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >

            <form
              className="form-inline my-2 my-lg-0 mr-auto"
              onSubmit = {this.onSearchTermSubmit}
            >
              <input
                ref = 'searchTermInput'
                className="form-control mr-sm-2"
                type="text"
                placeholder="Search"
              />
              <button
                className="btn btn-outline-success my-2 my-sm-0"
                type="submit"
              >
                <i className = 'fa fa-search'></i>
              </button>
            </form>

            {this.authRender()}
          </div>
        </nav>
    );
  }
}

export default createContainer(Navbar, {
  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${Auth.getFragment('viewer')}
        }
      `;
    }
  }
});
