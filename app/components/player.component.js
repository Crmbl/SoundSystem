import React from 'react';
import Play from './play.component';
import Meter from './meter.component';
import Loop from './loop.component';
import Volume from './volume.component';

class Player extends React.Component{

  render() {
    return (
      <div className="player">
        <Play />
        <Meter  />
        <Loop />
        <Volume />
      </div>
    );
  }

}

export default Player