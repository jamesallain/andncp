'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userCrudMailSend = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var subjectCreate = function subjectCreate(type, email) {
  switch (type) {
    case 'userCreate':
      return 'Welcome ' + email + ', your login details.';
    case 'userPasswordReset':
      return 'Weclome back ' + email + ', you have reset your password.';
    case 'userUpdate':
      return 'Welcome back ' + email + ', you have updated your login-details.';
    case 'userDelete':
      return 'Bye ' + email + ', you have deleted your account';
  }
};

var Html = function (_Component) {
  (0, _inherits3.default)(Html, _Component);

  function Html() {
    (0, _classCallCheck3.default)(this, Html);
    return (0, _possibleConstructorReturn3.default)(this, (Html.__proto__ || Object.getPrototypeOf(Html)).apply(this, arguments));
  }

  (0, _createClass3.default)(Html, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'h4',
          null,
          this.props.subject
        ),
        this.props.type !== 'userDelete' && _react2.default.createElement(
          'dl',
          null,
          _react2.default.createElement(
            'dt',
            null,
            'Email'
          ),
          _react2.default.createElement(
            'dd',
            null,
            this.props.email
          ),
          _react2.default.createElement(
            'dt',
            null,
            'Password'
          ),
          _react2.default.createElement(
            'dd',
            null,
            this.props.password
          )
        )
      );
    }
  }]);
  return Html;
}(_react.Component);

var htmlCreate = function htmlCreate(subject, email, password, type) {
  return _server2.default.renderToString(_react2.default.createElement(Html, {
    subject: subject,
    email: email,
    password: password,
    type: type
  }));
};

var userCrudMailSend = function userCrudMailSend(type, email, password) {
  var subject = subjectCreate(type, email);
  var html = htmlCreate(subject, email, password, type);

  var transporter = _nodemailer2.default.createTransport({
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.npm_package_config_GMAIL_USER,
      pass: process.env.npm_package_config_GMAIL_PASS
    }
  });

  var mailOpts = {
    from: process.env.npm_package_config_GMAIL_USER,
    to: email,
    subject: subject,
    html: html
  };

  transporter.sendMail(mailOpts, function (err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
  });
};

exports.userCrudMailSend = userCrudMailSend;
//# sourceMappingURL=index.js.map