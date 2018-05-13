import React from 'react';
import ClassNames from 'classnames';
import Dropzone from 'react-dropzone';

class Player extends React.Component{

  render() {
    const playPauseClass = ClassNames({
      'button fas fa-play': this.props.playStatus == 'PLAYING' ? false : true,
      'button fas fa-pause': this.props.playStatus == 'PLAYING' ? true : false
    });

    return (
      <div className="player">
        <div className={playPauseClass} onClick={this.props.togglePlay} />
        <Dropzone onDropAccepted={this.props.onDropAccepted}
                  className="drop-zone"
                  accept="audio/flac, audio/mp3"
                  disableClick={false}>
          <div className="border">
            <span id="ProgressSpan" className="drop-look" />
          </div>
        </Dropzone>
        <div id="Loop" className="button far fa-circle off" onClick={this.props.toggleLoop} />
        <div id="Mute" className="button fas fa-volume-up" onClick={this.props.toggleMute} />
      </div>
    );
  }

}

export default Player