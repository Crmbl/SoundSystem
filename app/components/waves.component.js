import React from 'react';

class Waves extends React.Component{

  render() {
    
    return (
      <div id="Waves" className="waves" onDoubleClick={this.props.onDoubleClick} />
    );
  }

}

export default Waves