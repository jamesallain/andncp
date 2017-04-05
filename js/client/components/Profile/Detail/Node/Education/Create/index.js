'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import BootstrapDatepicker from 'components/BootstrapDatepicker';
import ProfileEducationCreateMutation from 'mutations/ProfileEducationCreate';

class Create extends Component {
  state = {
    date: '',
    degree: '',
    title: ''
  };
  onChangeHandle = (evnt) => {
    this.setState({
      [$(evnt.currentTarget).data('key')]: $(evnt.currentTarget).val()
    });
  };
  onDateChangeHandle = (date) => {
    this.setState({date});
  };
  errShow = (err) => {
    $(this.refs.profileEducationCreate)
      .find('.form-group')
      .toArray()
      .reduce((memo, el) => {

        if (/date/.test(err.source)) {
          $(this.refs.dateFormGroup)
            .addClass('has-danger')
            .find('.form-control-feedback')
            .text(err.message);

          return [
            ...memo,
            el
          ];
        }

        else if ($(el).find('.form-control').data('key') === err.source) {
          $(el)
            .addClass('has-danger')
            .find('.form-control-feedback')
            .text(err.message);

          return [
            ...memo,
            el
          ];
        }

        return memo;

      }, []);
  };
  errClear = () => {
    $(this.refs.profileEducationCreate)
      .find('.form-group')
      .removeClass('has-danger')
      .find('.form-control-feedback')
      .text('');
  };
  profileEducationCreate = () => {
    this.props.relay.commitUpdate(
      new ProfileEducationCreateMutation({
        date: this.state.date.trim(),
        degree: this.state.degree.trim(),
        title: this.state.title.trim(),
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
  onSubmitHandle = (evnt) => {
    evnt.preventDefault();
    evnt.stopPropagation();

    this.errClear();

    this.profileEducationCreate();
  };
  onCancelHandle = (evnt) => {
    evnt.preventDefault();
    evnt.stopPropagation();

    this.props.onCreateCancel();
  };
  formRender() {
    return (
      <form
        ref = 'profileEducationCreate'
        className = 'col-6 col-md-4'
        onSubmit = {this.onSubmitHandle}
      >
        <div
          ref = 'dateFormGroup'
          className = 'form-group'
        >
          <BootstrapDatepicker
            className = 'form-control'
            placeholder = 'date'
            minViewMode = 'years'
            format = 'yyyy'
            formatter = 'YYYY'
            eventName = 'changeYear'
            value = {this.state.date}
            data-key = 'date'
            onSuccess = {this.onDateChangeHandle}
          />
          <span className = 'form-control-feedback'></span>
        </div>
        <div
          ref = 'degreeFormGroup'
          className = 'form-group'
        >
          <input
            type = 'text'
            ref = 'degreeInput'
            className = 'form-control'
            placeholder = 'degree'
            value = {this.state.degree}
            data-key = 'degree'
            onChange = {this.onChangeHandle}
          />
          <span className = 'form-control-feedback'></span>
        </div>
        <div
          ref = 'titleFormGroup'
          className = 'form-group'
        >
          <input
            type = 'text'
            ref = 'titleInput'
            className = 'form-control'
            placeholder = 'institution'
            value = {this.state.title}
            data-key = 'title'
            onChange = {this.onChangeHandle}
          />
          <span className = 'form-control-feedback'></span>
        </div>

        <div className = 'btn-group'>
          {
            (this.props.createTriggered &&
             !this.props.createRequired) &&
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
            value = 'Create'
          />
        </div>
      </form>
    );
  }
  cardBlockRender() {
    return (
      <div className = 'card-block'>
        {this.formRender()}
      </div>
    );
  }
  cardRender() {
    return (
      <div className = 'card'>
        {this.cardBlockRender()}
      </div>
    );
  }
  render() {
    return (
      <div className = 'Create'>
        {this.cardRender()}
      </div>
    );
  }
}

export default createContainer(Create, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Profile {
          ${ProfileEducationCreateMutation.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${ProfileEducationCreateMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
