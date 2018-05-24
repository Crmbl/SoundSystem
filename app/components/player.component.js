import React from 'react';
import ClassNames from 'classnames';
import Dropzone from 'react-dropzone';

class Player extends React.Component{

  render() {
    return (
      <div className="player">
        <div id="Play" className="button fas fa-play" onClick={this.props.togglePlay} />
        <div id="WaveformContainer">
          <div id="WaveControllers">
            <canvas id="GooeyWaves" className="small-cube" onClick={this.props.toggleGooey} />
            <canvas id="NormalWaves" className="small-cube" onClick={this.props.toggleNormal} />
            <canvas id="NoWave" className="small-cube" onClick={this.props.toggleNoWave} />
          </div>
        </div>
        <Dropzone onDropAccepted={this.props.onDropAccepted}
                  className="drop-zone"
                  accept="audio/flac, audio/mp3">
          <div className="border">
            <span id="ProgressSpan" className="drop-look" />
          </div>
        </Dropzone>
        <div id="Loop" className="button far fa-circle off" onClick={this.props.toggleLoop} />
        <div id="Mute" className="button fas fa-volume-up" onClick={this.props.toggleMute} />
        <div id="SliderContainer">
          <input id="VolumeSlider" type="range" min="0" max="100" className="slider" 
                onInput={this.props.onInput} />
        </div>
      </div>
    );
  }
  
}

export default Player