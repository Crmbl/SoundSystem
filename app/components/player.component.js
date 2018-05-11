import React from 'react';
import Dropzone from 'react-dropzone';
import Play from './play.component';
import Meter from './meter.component';
import Loop from './loop.component';
import Volume from './volume.component';

class Player extends React.Component{

  render() {
    return (
      <div className="player dropzone">
        <Dropzone onDrop={this.onDrop.bind(this)} className="drop-zone"/>
        <Play />
        <Meter  />
        <Loop />
        <Volume />
      </div>
    );
  }

  onDrop(acceptedFiles, rejectedFiles) {
    alert("YOLO SWAG TMTC");
  }

}

export default Player