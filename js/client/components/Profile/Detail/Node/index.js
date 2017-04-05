'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Jumbotron from './Jumbotron';
import Experience from './Experience';
import Education from './Education';
import Skill from './Skill';

class Node extends Component {
  jumbotronRender() {
    return (
      <Jumbotron
        node = {this.props.node}
        isCreator = {this.props.isCreator}
        viewer = {this.props.viewer}
      />
    );
  }
  experienceRender() {
    return (
      <Experience
        node = {this.props.node}
        isCreator = {this.props.isCreator}
        viewer = {this.props.viewer}
      />
    );
  }
  educationRender() {
    return (
      <Education
        node = {this.props.node}
        viewer = {this.props.viewer}
      />
    );
  }
  skillRender() {
    return (
      <Skill
        node = {this.props.node}
        viewer = {this.props.viewer}
      />
    );
  }
  nodeRender() {
    return (this.props.node) &&
      <div>
        {this.jumbotronRender()}
        {this.experienceRender()}
        <hr/>
        {this.educationRender()}
        <hr/>
        {this.skillRender()}
      </div>;
  }
  render() {
    return (
      <div
        className = 'Node col-md-8 offset-md-2'
      >
        {this.nodeRender()}
      </div>
    );
  }
}

export default createContainer(Node, {
  fragments: {
    node() {
      return Relay.QL`
        fragment on Profile {
          ${Jumbotron.getFragment('node')},
          ${Experience.getFragment('node')},
          ${Education.getFragment('node')},
          ${Skill.getFragment('node')}
        }
      `;
    },
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          ${Jumbotron.getFragment('viewer')},
          ${Experience.getFragment('viewer')},
          ${Education.getFragment('viewer')},
          ${Skill.getFragment('viewer')}
        }
      `;
    }
  }
});
