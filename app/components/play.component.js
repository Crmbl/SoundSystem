import React from 'react';

class Play extends React.Component{

  render() {
    return (
        <div className="button fas fa-play" onClick="togglePlay">
        </div>
    );
  }
// fa-pause
}

function togglePlay() {
  // if (this.className)
  console.log(this.className);
}

export default Play