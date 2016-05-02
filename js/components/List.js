import React from 'react';
import Relay from 'react-relay';

class Tea extends React.Component {
  render() {
    var {tes_id, name, steepingTime} = this.props.tea;
    return (
      <li key={tes_id}>
        {name} (<em>{steepingTime} min</em>)
      </li>
    );
  }
}
Tea = Relay.createContainer(Tea, {
  fragments: {
    tea: () => Relay.QL`
      fragment on Tea {
        tes_id,
        name,
        steepingTime,
      }
    `,
  },
});

export class TeaStore extends React.Component {
  render() {
    return <ul>
      {this.props.store.teas.map(
        tea => <Tea tea={tea} />
      )}
    </ul>;
  }
}

export default Relay.createContainer(TeaStore, {
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        teas { ${Tea.getFragment('tea')} },
      }
    `,
  },
});
