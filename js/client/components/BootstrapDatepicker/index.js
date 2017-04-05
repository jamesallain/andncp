'use strict';

import React, {Component} from 'react';
import {createContainer} from 'react-relay';
import moment from 'moment';

class BootstrapDatepicker extends Component {
  state = {
    value: this.props.value
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.startDate !== this.props.startDate) {
      this.setState({value: ''});
    }
  }
  onChangeMonthAddEventListener = () => {
    $(this.refs.datepicker)
      .on(
        this.props.eventName,
        (evnt) => {
          this.setState(
            {
              value: moment(evnt.date).format(this.props.formatter)
            },
            () => {
              $(this.refs.datepicker)
                .datepicker('destroy');

              this.props.onSuccess(this.state.value);
            }
          );
        }
      );
  };
  datepickerInit = () => {
    const now = moment(new Date()).format(this.props.formatter);

    $(this.refs.datepicker)
      .datepicker({
        minViewMode: this.props.minViewMode,
        format: this.props.format,
        defaultViewDate: this.state.value || this.props.startDate || now,
        startDate: this.props.startDate
      });
  };
  onClickHandle = () => {
    this.datepickerInit();
    this.onChangeMonthAddEventListener();
  };
  onMouseLeaveHandle = () => {
    $(this.refs.datepicker)
      .datepicker('destroy');
  };
  onChangeHandle = () => {

  };
  render() {
    return (
      <div
        className = 'BootstrapDatepicker'
        onMouseLeave = {this.onMouseLeaveHandle}
      >
        <input
          type = 'text'
          className = 'form-control'
          placeholder = {this.props.placeholder}
          value = {this.state.value}
          onClick = {this.onClickHandle}
          onChange = {this.onChangeHandle}
        />
        <div
          ref = 'datepicker'
          className = 'datepicker'
        >
        </div>
      </div>
    );
  }
}

export default createContainer(BootstrapDatepicker, {
  fragments: {}
});
