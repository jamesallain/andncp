'use strict';

import React, {Component} from 'react';
import Relay, {createContainer} from 'react-relay';

import Node from './Node';
import Loading from 'components/Loading';
import Empty from 'components/Empty';

class Edges extends Component {
  state = {
    loading: false,
    searchTermInput: null
  };
  componentDidMount() {
    this.variablesFirstSet(this.props);

    window.addEventListener('scroll', this.load);
  }
  componentWillReceiveProps(nextProps) {
    this.variablesSearchTermSet(nextProps);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.load);
  }
  variablesSearchTermSet = (props) => {
    if (props.searchTermInput !== this.state.searchTermInput) {
      this.setState({searchTermInput: props.searchTermInput}, () => {
        this.props.relay.setVariables(
          {searchTerm: props.searchTermInput}
        );
      });
    }
  };
  load = () => {
    if (!this.state.loading &&
      this.props.viewer.profile.pageInfo.hasNextPage &&
      ($(window).scrollTop() + $(window).height()) > $(document).height() - 100) {
      return new Promise((resolve) => {
        return this.setState({loading: true}, () => {
          return this.props.relay.setVariables(
            {after: this.props.viewer.profile.pageInfo.endCursor},
            (readyState) => {
              if (readyState.mounted &&
                readyState.done) {
                return this.props.relay.setVariables(
                  {first: this.props.relay.variables.first + 10},
                  (readyState) => {
                    if (readyState.mounted &&
                      readyState.done) {
                      return this.setState({loading: false}, () => {
                        return resolve(null);
                      });
                    }
                  }
                );
              }
            }
          );
        });
      })
        .then(() => {
          this.variablesFirstSet(this.props);
        });
    }
    return Promise.resolve(null);
  };
  variablesFirstSet = (props) => {
    const edgeCount = props.viewer.profile.edges.length;

    if (edgeCount &&
        edgeCount !== this.props.relay.variables.first) {
      this.props.relay.setVariables(
        {first: edgeCount}
      );
    }
  };
  edgesRender() {
    return (this.props.viewer.profile.edges.length > 0) ?
      this.props.viewer.profile.edges.reduce((memo, edge) => {

        if (edge.node.fullName) {
          return [
            ...memo,
            <Node
              key = {edge.node.id}
              node = {edge.node}
            />
          ];
        }

        return memo;

      }, []) :
      <Empty/>;
  }
  loadingRender() {
    return (this.state.loading) &&
      <Loading/>;
  }
  render() {
    return (
      <div className = 'Edges'>
        {this.edgesRender()}
        {this.loadingRender()}
      </div>
    );
  }
}

export default createContainer(Edges, {
  initialVariables: {
    first: 10,
    after: null,
    searchTerm: ''
  },
  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          profile(searchTerm: $searchTerm, first: $first, after: $after) {
            edges {
              node {
                id,
                fullName,
                ${Node.getFragment('node')}
              }
            },
            pageInfo {
              hasNextPage,
              endCursor
            }
          }
        }
      `;
    }
  }
});
