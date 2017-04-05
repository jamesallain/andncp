'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';
import {browserHistory} from 'react-router';

import UserUpdateMutation from 'mutations/UserUpdate';

class Update extends Component {
  state = {
    email: this.props.user.email || '',
    password: ''
  };
  errShow = (err) => {
    $(this.refs.userUpdate)
      .find('.form-group')
      .toArray()
      .reduce((memo, el) => {

        if ($(el).find('input').data('key') === err.source) {

          $(el).addClass('has-danger');
          $(el).find('.form-control-feedback').text(err.message);

          return [
            ...memo,
            el
          ];
        }

        return memo;

      }, []);
  };
  onChangeHandle = (evnt) => {
    this.setState({
      [$(evnt.currentTarget).data('key')]: $(evnt.currentTarget).val()
    });
  };
  userUpdate = () => {
    this.props.relay.commitUpdate(
      new UserUpdateMutation({
        email: this.state.email.trim(),
        password: this.state.password.trim(),
        user: this.props.user,
        viewer: this.props.viewer
      }),
      {
        onFailure: (transaction) => {
          const err = transaction.getError().source.errors[0].message;
          this.errShow(err);
        },
        onSuccess: () => {
          browserHistory.push(`/Profile/${this.props.user.profileId}`);
        }
      }
    );
  };
  errClear = () => {
    $(this.refs.userUpdate)
      .find('.form-group')
      .removeClass('has-danger');
    $(this.refs.userUpdate)
      .find('.form-control-feedback')
      .text('');
  };
  onSubmitHandle = (evnt) => {
    evnt.preventDefault();
    evnt.stopPropagation();

    this.errClear();

    this.userUpdate();
  };
  formRender() {
    return (
      <form
        ref = 'userUpdate'
        onSubmit = {this.onSubmitHandle}
      >
        <div
          ref = 'emailFormGroup'
          className = 'form-group'
        >
          <input
            type = 'text'
            className = 'form-control'
            value = {this.state.email}
            disabled = 'true'
          />
        </div>
        <div
          ref = 'passwordFormGroup'
          className = 'form-group'
        >
          <input
            type = 'password'
            ref = 'passwordInput'
            className = 'form-control'
            placeholder = '********'
            onChange = {this.onChangeHandle}
            data-key = 'password'
          />
          <span className = 'form-control-feedback'></span>
        </div>
        <div className = 'btn-group'>
          <input
            type = 'submit'
            className = 'btn btn-secondary'
            value = 'Update'
          />
        </div>
      </form>
    );
  }
  render() {
    return (
      <div className = 'Update'>
        {this.formRender()}
      </div>
    );
  }
}

export default createContainer(Update, {
  fragments: {
    user() {
      return Relay.QL`
        fragment on User {
          email,
          profileId,
          ${UserUpdateMutation.getFragment('user')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${UserUpdateMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
