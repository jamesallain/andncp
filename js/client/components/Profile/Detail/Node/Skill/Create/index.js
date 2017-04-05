'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import ProfileSkillCreateMutation from 'mutations/ProfileSkillCreate';

class Create extends Component {
  state = {
    name: ''
  };
  onChangeHandle = (evnt) => {
    this.setState({
      [$(evnt.currentTarget).data('key')]: $(evnt.currentTarget).val()
    });
  };
  onCancelHandle = (evnt) => {
    evnt.preventDefault();
    evnt.stopPropagation();

    this.props.onCreateCancel();
  };
  errShow = (err) => {
    $(this.refs.profileSkillCreate)
      .find('.form-group')
      .toArray()
      .reduce((memo, el) => {

        if ($(el).find('.form-control').data('key') === err.source) {
          $(el)
            .addClass('has-danger')
            .find('.form-control-feedback')
            .text(err.message);

          return [
            ...memo,
            el
          ];
        }
      }, []);
  };
  profileSkillCreate = () => {
    this.props.relay.commitUpdate(
      new ProfileSkillCreateMutation({
        name: this.state.name.trim(),
        node: this.props.node,
        viewer: this.props.viewer
      }),
      {
        onFailure: (transaction) => {
          const err = transaction.getError().source.errors[0].message;
          this.errShow(err);
        },
        onSuccess: () => {
          this.props.onCreateSucces();
        }
      }
    );
  };
  errClear = () => {
    $(this.refs.profileSkillCreate)
      .find('.form-group')
      .removeClass('has-danger')
      .find('.form-control-feedback')
      .text('');
  };
  onSubmitHandle = (evnt) => {
    evnt.preventDefault();
    evnt.stopPropagation();

    this.errClear();

    this.profileSkillCreate();
  };
  formRender() {
    return (
      <form
        ref = 'profileSkillCreate'
        className = 'col-4'
        onSubmit = {this.onSubmitHandle}
      >
        <div
          ref = 'nameFormGroup'
          className = 'form-group'
        >
          <input
            type = 'text'
            ref = 'nameInput'
            className = 'form-control'
            placeholder = 'name'
            value = {this.state.name}
            data-key = 'name'
            onChange = {this.onChangeHandle}
          />
          <span className = 'form-control-feedback'></span>
        </div>

        <div className = 'btn-group'>
          {
            (!this.props.createRequired &&
             this.props.createTriggered) &&
              <button
                className = 'btn btn-outline-warning'
                onClick = {this.onCancelHandle}
              >
                Cancel
              </button>
          }
          <input
            type = 'submit'
            className = 'btn btn-outline-success'
          />
        </div>
      </form>
    );
  }
  render() {
    return (
      <div className = 'Create'>
        {this.formRender()}
      </div>
    );
  }
}

export default createContainer(Create, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Profile {
          ${ProfileSkillCreateMutation.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${ProfileSkillCreateMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
