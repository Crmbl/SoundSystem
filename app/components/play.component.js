import React from 'react';

class Play extends React.Component{

  render() {
    return (
        <div className="button fas fa-play" onClick={this.togglePlay}>
        </div>
    );
  }

  togglePlay() {
    // if (this.className)
    alert(this.className);
  }
// fa-pause
}

export default Play