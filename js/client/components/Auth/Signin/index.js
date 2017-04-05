'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';
import {browserHistory} from 'react-router';

import UserSigninMutation from 'mutations/UserSignin';

class Signin extends Component {
  state = {
    email: '',
    password: ''
  };
  onChangeHandle = (evnt) => {
    this.setState({
      [$(evnt.currentTarget).data('key')]: $(evnt.currentTarget).val()
    });
  };
  errShow = (err) => {
    $(this.refs.userSignin)
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
  errClear = () => {
    $(this.refs.userSignin)
      .find('.form-group')
      .toArray()
      .reduce((memo, el) => {
        $(el).removeClass('has-danger');
        $(el).find('.form-control-feedback').text('');

        return [
          ...memo,
          el
        ];
      }, []);
  };
  userSignin = () => {
    this.errClear();

    this.props.relay.commitUpdate(
      new UserSigninMutation({
        email: this.state.email.trim(),
        password: this.state.password.trim(),
        user: this.props.viewer.user,
        viewer: this.props.viewer
      }),
      {
        onFailure: (transaction) => {
          const err = transaction.getError().source.errors[0].message;
          this.errShow(err);
        },
        onSuccess: (res) => {
          browserHistory.push(`/Profile/${res.userSignin.field.profileId}`);
        }
      }
    );
  };
  onSubmitHandle = (evnt) => {
    evnt.preventDefault();
    evnt.stopPropagation();

    this.userSignin();
  };
  formRender() {
    return (
      <form
        ref = 'userSignin'
        onSubmit = {this.onSubmitHandle}
      >
        <div
          ref = 'emailFormGroup'
          className = 'form-group'
        >
          <input
            type = 'text'
            ref = 'emailInput'
            className = 'form-control'
            placeholder = 'Email'
            value = {this.state.email}
            data-key = 'email'
            onChange = {this.onChangeHandle}
          />
          <span className = 'form-control-feedback'></span>
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
            value = {this.state.password}
            data-key = 'password'
            onChange = {this.onChangeHandle}
          />
          <span className = 'form-control-feedback'></span>
        </div>

        <div className = 'btn-group'>
          <input
            type = 'submit'
            className = 'btn btn-secondary'
            value = 'Signin'
            onClick = {this.onSubmitHandle}
          />
        </div>
      </form>
    );
  }
  render() {
    return (
      <div className = 'Signin'>
        {this.formRender()}
      </div>
    );
  }
}

export default createContainer(Signin, {
  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          user {
            profileId,
            ${UserSigninMutation.getFragment('user')}
          },
          ${UserSigninMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
