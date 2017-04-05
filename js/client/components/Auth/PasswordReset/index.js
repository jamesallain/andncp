'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import UserPasswordResetMutation from 'mutations/UserPasswordReset';

class PasswordReset extends Component {
  state = {
    email: ''
  };
  onChangeHandle = (evnt) => {
    this.setState({
      [$(evnt.currentTarget).data('key')]: $(evnt.currentTarget).val()
    });
  };
  errShow = (err) => {
    $(this.refs.userPasswordReset)
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
    $(this.refs.userPasswordReset)
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
  userPasswordReset = () => {
    this.errClear();

    this.props.relay.commitUpdate(
      new UserPasswordResetMutation({
        email: this.state.email.trim(),
        viewer: this.props.viewer
      }),
      {
        onFailure: (transaction) => {
          const err = transaction.getError().source.errors[0].message;
          this.errShow(err);
        },
        onSuccess: () => {
          this.setState({email: 'Please check your inbox.'});
          $('input').blur();
        }
      }
    );
  };
  onSubmitHandle = (evnt) => {
    evnt.preventDefault();
    evnt.stopPropagation();

    this.userPasswordReset();
  };
  formRender() {
    return (
      <form
        ref = 'userPasswordReset'
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
            value = {this.state.email}
            placeholder = 'Email'
            data-key = 'email'
            onChange = {this.onChangeHandle}
          />
          <span className = 'form-control-feedback'></span>
        </div>

        <div className = 'btn-group'>
          <input
            type = 'submit'
            className = 'btn btn-secondary'
            value = 'Reset'
            onClick = {this.onSubmitHandle}
          />
        </div>
      </form>
    );
  }
  render() {
    return (
      <div className = 'PasswordReset'>
        {this.formRender()}
      </div>
    );
  }
}

export default createContainer(PasswordReset, {
  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${UserPasswordResetMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
