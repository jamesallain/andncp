'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';
import {CountryDropdown, RegionDropdown} from 'react-country-region-selector';

import ProfileUpdateMutation from 'mutations/ProfileUpdate';

class Update extends Component {
  state = {
    fullName: this.props.node.fullName || '',
    title: this.props.node.title || '',
    currentCompany: this.props.node.currentCompany || '',
    educationTitle: this.props.node.educationTitle || '',
    country: this.props.node.country || '',
    region: this.props.node.region || ''
  };
  onChangeHandle = (evnt) => {
    this.setState({
      [$(evnt.currentTarget).data('key')]: $(evnt.currentTarget).val()
    });
  };
  onCountrySelectHandle = (country) => {
    this.setState({country});
  };
  onRegionSelectHandle = (region) => {
    this.setState({region});
  };
  errShow = (err) => {
    $(this.refs.profileUpdate)
      .find('.form-group')
      .toArray()
      .reduce((memo, el) => {

        if (/(country|region)/.test(err.source)) {
          $([this.refs.countryFormGroup, this.refs.regionFormGroup])
            .addClass('has-danger')
            .find('.btn')
            .addClass('btn-danger')
            .end()
            .find('.form-control-feedback')
            .text(err.message);

          return [
            ...memo,
            el
          ];
        }

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
  profileUpdate = () => {
    this.props.relay.commitUpdate(
      new ProfileUpdateMutation({
        fullName: this.state.fullName.trim(),
        title: this.state.title.trim(),
        currentCompany: this.state.currentCompany.trim(),
        educationTitle: this.state.educationTitle.trim(),
        country: this.state.country.trim(),
        region: this.state.region.trim(),
        node: this.props.node,
        viewer: this.props.viewer
      }),
      {
        onFailure: (transaction) => {
          const err = transaction.getError().source.errors[0].message;
          this.errShow(err);
        },
        onSuccess: () => {
          this.props.onProfileUpdateSuccess();
        }
      }
    );
  };
  errClear = () => {
    $(this.refs.profileUpdate)
      .find('.form-group')
      .removeClass('has-danger')
      .find('.form-control-feedback')
      .text('');

    $(this.refs.profileUpdate)
      .find('.btn-danger')
      .removeClass('btn-danger');
  };
  onSubmitHandle = (evnt) => {
    evnt.preventDefault();
    evnt.stopPropagation();

    this.errClear();

    this.profileUpdate();
  };
  onCancelHandle = (evnt) => {
    evnt.preventDefault();
    evnt.stopPropagation();

    this.props.onProfileUpdateCancel();
  };
  formRender() {
    return (
      <form
        ref = 'profileUpdate'
        onSubmit = {this.onSubmitHandle}
      >
        <div
          ref = 'fullNameFormGroup'
          className = 'form-group'
        >
          <input
            type = 'input'
            ref = 'fullNameInput'
            className = 'form-control col-sm-8 offset-sm-2 col-md-4 offset-md-4'
            placeholder = 'full name'
            value = {this.state.fullName}
            data-key = 'fullName'
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
            className = 'form-control col-sm-8 offset-sm-2 col-md-4 offset-md-4'
            placeholder = 'job title'
            value = {this.state.title}
            data-key = 'title'
            onChange = {this.onChangeHandle}
          />
          <span className = 'form-control-feedback'></span>
        </div>
        <div className = 'col-sm-8 offset-sm-2 col-md-4 offset-md-4'>
          <div className = 'row'>
            <div
              ref = 'curentCompanyFormGroup'
              className = 'form-group col-6'
              style = {{
                padding: 0
              }}
            >
              <input
                type = 'text'
                ref = 'currentCompanyInput'
                className = 'form-control'
                placeholder = 'current company'
                value = {this.state.currentCompany}
                data-key = 'currentCompany'
                onChange = {this.onChangeHandle}
              />
              <span className = 'form-control-feedback'></span>
            </div>
            <div
              ref = 'educationTitleFormGroup'
              className = 'form-group col-6'
              style = {{
                padding: 0
              }}
            >
              <input
                type = 'text'
                ref = 'educationTitleInput'
                className = 'form-control'
                placeholder = 'education title'
                value = {this.state.educationTitle}
                data-key = 'educationTitle'
                onChange = {this.onChangeHandle}
              />
              <span className = 'form-control-feedback'></span>
            </div>
          </div>
          <div className = 'row'>
            <div className = 'form-group col-6'>
              <CountryDropdown
                classes = 'btn btn-secondary dropdown-toggle col-12'
                value = {this.state.country}
                onChange = {this.onCountrySelectHandle}
              />
            </div>
            <div className = 'form-group col-6'>
              <RegionDropdown
                country = {this.state.country}
                value = {this.state.region}
                classes = 'btn btn-secondary dropdown-toggle col-12'
                onChange = {this.onRegionSelectHandle}
              />
            </div>
          </div>
        </div>
        <br/>
        <div className = 'btn-group'>
          {
            (!this.props.updateRequired &&
             this.props.updateTriggered) &&
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
            value = 'Submit'
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
    node() {
      return Relay.QL`
        fragment on Profile {
          fullName,
          title,
          currentCompany,
          educationTitle,
          country,
          region
          ${ProfileUpdateMutation.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${ProfileUpdateMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
