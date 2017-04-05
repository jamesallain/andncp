'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Signup from './Signup';
import Signin from './Signin';
import User from './User';
import PasswordReset from './PasswordReset';

class Auth extends Component {
  state = {
    isSignedin: isSignedinGet(this.props)
  };
  componentDidMount() {
    this.tabDisableToggle();
    this.nav(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.stateIsSignedinSet(nextProps)

    .then(() => {
      this.tabDisableToggle();

      this.nav(nextProps);
    });
  }
  tabDisableToggle = () => {
    $(this.refs.authTab)
      .find('a')
      .removeClass('disabled');

    if (!this.state.isSignedin) {
      ['Account']
        .reduce((memo, tab) => {
          $(this.refs.authTab)
            .find(`a[href="#${tab}"]`)
            .addClass('disabled');

          return [
            ...memo,
            tab
          ];
        }, []);
    }
    else {
      ['Signin', 'Signup', 'PasswordReset']
        .reduce((memo, tab) => {
          $(this.refs.authTab)
            .find(`a[href="#${tab}"]`)
            .addClass('disabled');

          return [
            ...memo,
            tab
          ];
        }, []);
    }
  };
  stateIsSignedinSet = (props) => {
    return new Promise((resolve) => {
      this.setState(
        {isSignedin: isSignedinGet(props)},
        () => {
          return resolve(null);
        }
      );
    });
  };
  nav = (props) => {
    const hash = props.location.hash;

    $(this.refs.authTab)
      .find(`a[href="${hash}"]`)
      .tab('show');
  };
  navRender() {
    return (
      <ul
        ref = 'authTab'
        className = "nav nav-tabs"
        role="tablist"
      >
        <li className = "nav-item">
          <a
            className = "nav-link active"
            data-toggle="tab"
            href="#Signin"
            role="tab"
          >
            Signin
          </a>
        </li>
        <li className = "nav-item">
          <a
            className = "nav-link"
            data-toggle="tab"
            href="#Signup"
            role="tab"
          >
            Signup
          </a>
        </li>
        <li className = "nav-item">
          <a
            className = "nav-link"
            data-toggle="tab"
            href="#Account"
            role="tab"
          >
            Account
          </a>
        </li>
        <li className = "nav-item">
          <a
            className = "nav-link"
            data-toggle="tab"
            href="#PasswordReset"
            role="tab"
          >
            Forgot Password ?
          </a>
        </li>
      </ul>
    );
  }
  tabRender() {
    return (
      <div className = "tab-content">
        <div
          className = "tab-pane active"
          id="Signin"
          role="tabpanel"
        >
          <Signin
            viewer = {this.props.viewer}
          />
        </div>
        <div
          className = "tab-pane"
          id="Signup"
          role="tabpanel"
        >
          <Signup
            viewer = {this.props.viewer}
          />
        </div>
        <div
          className = "tab-pane"
          id="Account"
          role="tabpanel"
        >
          <User
            user = {this.props.viewer.user}
            viewer = {this.props.viewer}
          />
        </div>
        <div
          className = "tab-pane"
          id="PasswordReset"
          role="tabpanel"
        >
          <PasswordReset
            viewer = {this.props.viewer}
          />
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className = 'Auth col-md-6 offset-md-3'>
        <br/>
        {this.navRender()}
        <br/>
        {this.tabRender()}
        <br/>
      </div>
    );
  }
}

export default createContainer(Auth, {
  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          user {
            email,
            ${User.getFragment('user')}
          },
          ${Signup.getFragment('viewer')},
          ${Signin.getFragment('viewer')},
          ${User.getFragment('viewer')},
          ${PasswordReset.getFragment('viewer')}
        }
      `;
    }
  }
});

const isSignedinGet = (props) => {
  return (props.viewer.user.email) ?
    true :
    false;
};
