'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';
import {CountryDropdown, RegionDropdown} from 'react-country-region-selector';
import autosize from 'autosize';

import BootstrapDatepicker from 'components/BootstrapDatepicker';
import ProfileExperienceUpdateMutation from 'mutations/ProfileExperienceUpdate';

class Update extends Component {
  state = {
    company: this.props.item.company,
    title: this.props.item.title,
    country: this.props.item.country,
    region: this.props.item.region,
    since: this.props.item.since,
    until: this.props.item.until,
    description: this.props.item.description
  };
  componentDidMount() {
    autosize($(this.refs.descriptionTextarea));
  }
  onChangeHandle = (evnt) => {
    this.setState({
      [$(evnt.currentTarget).data('key')]: $(evnt.currentTarget).val()
    });
  };
  onCountrySelectHandle = (country) => {
    this.setState({
      country,
      region: ''
    });
  };
  onRegionSelectHandle = (region) => {
    this.setState({region});
  };
  onSinceChangeHandle = (since) => {
    this.setState({
      since,
      until: ''
    });
  };
  onUntilChangeHandle = (until) => {
    this.setState({until});
  };
  errShow = (err) => {
    $(this.refs.profileExperienceUpdate)
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

        else if (/(since|until)/.test(err.source)) {
          $(this.refs.sinceFormGroup)
            .addClass('has-danger')
            .find('.form-control-feedback')
            .text(err.message);
          $(this.refs.untilFormGroup)
            .addClass('has-danger')
            .find('.form-control-feedback')
            .text(err.message);
        }

        else if ($(el).find('.form-control').data('key') === err.source) {
          $(el).addClass('has-danger');
          $(el).find('.form-control-feedback')
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
    $(this.refs.profileExperienceUpdate)
      .find('.form-group')
      .removeClass('has-danger');
    $(this.refs.profileExperienceUpdate)
      .find('.form-control-feedback')
      .text('');
    $(this.refs.profileExperienceUpdate)
      .find('.btn')
      .removeClass('btn-danger');
  };
  profileExperienceUpdate = () => {
    this.props.relay.commitUpdate(
      new ProfileExperienceUpdateMutation({
        company: this.state.company.trim(),
        description: this.state.description.trim(),
        region: this.state.region.trim(),
        country: this.state.country.trim(),
        since: this.state.since,
        title: this.state.title.trim(),
        until: this.state.until,
        item: this.props.item,
        node: this.props.node,
        viewer: this.props.viewer
      }),
      {
        onFailure: (transaction) => {
          const err = transaction.getError().source.errors[0].message;
          this.errShow(err);
        },
        onSuccess: () => {
          this.props.onUpdateSuccess();
        }
      }
    );
  };
  onSubmitHandle = (evnt) => {
    evnt.preventDefault();
    evnt.stopPropagation();

    this.errClear();

    this.profileExperienceUpdate();
  };
  onCancelHandle = (evnt) => {
    evnt.preventDefault();
    evnt.stopPropagation();

    this.props.onUpdateCancel();
  };
  formRender() {
    return (
      <form
        ref = 'profileExperienceUpdate'
        className = 'col-md-8 offset-md-2'
        onSubmit = {this.onSubmitHandle}
      >
        <div
          ref = 'companyFormGroup'
          className = 'form-group'
        >
          <input
            type = 'text'
            ref = 'companyInput'
            className = 'form-control'
            placeholder = 'company'
            value = {this.state.company}
            data-key = 'company'
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
            placeholder = 'title'
            value = {this.state.title}
            data-key = 'title'
            onChange = {this.onChangeHandle}
          />
          <span className = 'form-control-feedback'></span>
        </div>
        <div className = 'row'>
          <div
            ref = 'countryFormGroup'
            className = 'form-group col-6'
          >
            <CountryDropdown
              classes = 'btn btn-secondary dropdown-toggle col-12'
              className = 'form-control'
              value = {this.state.country}
              onChange = {this.onCountrySelectHandle}
            />
            <span className = 'form-control-feedback'></span>
          </div>
          <div
            ref = 'regionFormGroup'
            className = 'form-group col-6'
          >
            <RegionDropdown
              classes = 'btn btn-secondary dropdown-toggle col-12'
              className = 'form-control'
              country = {this.state.country}
              value = {this.state.region}
              onChange = {this.onRegionSelectHandle}
            />
            <span className = 'form-control-feedback'></span>
          </div>
        </div>
        <div className = 'row'>
            <div
              ref = 'sinceFormGroup'
              className = 'form-group col-6'
            >
              <BootstrapDatepicker
                className = 'form-control'
                placeholder = 'since'
                minViewMode = 'months'
                format = 'mm/yyyy'
                formatter = 'MM[/]YYYY'
                eventName = 'changeMonth'
                value = {this.state.since}
                data-key = 'since'
                onSuccess = {this.onSinceChangeHandle}
              />
              <span className = 'form-control-feedback'></span>
            </div>
            <div
              ref = 'untilFormGroup'
              className = 'form-group col-6'
            >
              <BootstrapDatepicker
                className = 'form-control'
                placeholder = 'until'
                minViewMode = 'months'
                format = 'mm/yyyy'
                formatter = 'MM[/]YYYY'
                eventName = 'changeMonth'
                value = {this.state.until}
                data-key = 'until'
                startDate = {this.state.since}
                onSuccess = {this.onUntilChangeHandle}
              />
              <span className = 'form-control-feedback'></span>
            </div>
        </div>
        <div
          ref = 'descriptionFormGroup'
          className = 'form-group'
        >
          <textarea
            ref = 'descriptionTextarea'
            className = 'form-control'
            placeholder = 'description'
            value = {this.state.description}
            data-key = 'description'
            onChange = {this.onChangeHandle}
          ></textarea>
          <span className = 'form-control-feedback'></span>
        </div>

        <div className = 'btn-group'>
          <button
            className = 'btn btn-outline-warning'
            value = 'Cancel'
            onClick = {this.onCancelHandle}
          >
            Cancel
          </button>
          <input
            type = 'submit'
            className = 'btn btn-outline-success'
            value = 'Update'
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

export default createContainer(Update, {
  fragments: {
    item() {
      return Relay.QL`
        fragment on Experience {
          id,
          company,
          description,
          region,
          country,
          since,
          title,
          until,
          ${ProfileExperienceUpdateMutation.getFragment('item')}
        }
      `;
    },
    node() {
      return Relay.QL`
        fragment on Profile {
          ${ProfileExperienceUpdateMutation.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${ProfileExperienceUpdateMutation.getFragment('viewer')}
        }
      `;
    }
  }
});
