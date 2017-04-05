'use strict';

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import nodemailer from 'nodemailer';

const subjectCreate = (type, email) => {
  switch (type) {
    case 'userCreate':
      return `Welcome ${email}, your login details.`;
    case 'userPasswordReset':
      return `Weclome back ${email}, you have reset your password.`;
    case 'userUpdate':
      return `Welcome back ${email}, you have updated your login-details.`;
    case 'userDelete':
      return `Bye ${email}, you have deleted your account`;
  }
};

class Html extends Component {
  render() {
    return (
      <div>
        <h4>{this.props.subject}</h4>

        {
          (this.props.type !== 'userDelete') &&
            <dl>
              <dt>Email</dt>
              <dd>{this.props.email}</dd>
              <dt>Password</dt>
              <dd>{this.props.password}</dd>
            </dl>
        }
      </div>
    );
  }
}

const htmlCreate = (subject, email, password, type) => {
  return ReactDOMServer.renderToString(
    <Html
      subject = {subject}
      email = {email}
      password = {password}
      type = {type}
    />
  );
};

const userCrudMailSend = (type, email, password) => {
  const subject = subjectCreate(type, email);
  const html = htmlCreate(subject, email, password, type);

  const transporter = nodemailer.createTransport(
    {
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.npm_package_config_GMAIL_USER,
        pass: process.env.npm_package_config_GMAIL_PASS
      }
    }
  );

  const mailOpts = {
    from: process.env.npm_package_config_GMAIL_USER,
    to: email,
    subject,
    html
  };

  transporter.sendMail(
    mailOpts,
    (err, res) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log(res);
      }
    }
  );
};

export {
  userCrudMailSend
};
