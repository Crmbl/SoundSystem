import React from 'react';
import Sound from 'react-sound';
import Waves from '../components/waves.component';
import Player from '../components/player.component';
import Handle from '../components/handle.component';

class AppContainer extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            track: {path: '', title: ''},
            playStatus: Sound.status.STOPPED,
            elapsed: '00:00',
            total: '00:00',
            position: 0,
            volume: 100,
            playFromPosition: 0
        }
    }

    render () {
        return (
            <div>
                <Waves />
                <Sound url={this.state.track.path}
                    playStatus={this.state.playStatus}
                    onPlaying={this.handleSongPlaying.bind(this)}
                    onFinishedPlaying={this.handleSongFinished.bind(this)}
                    playFromPosition={this.state.playFromPosition} />
                <Player togglePlay={this.togglePlay.bind(this)}
                        onDropAccepted={this.onDropAccepted.bind(this)}
                        toggleLoop={this.toggleLoop.bind(this)}
                        toggleMute={this.toggleMute.bind(this)} />
                <Handle />
            </div>
        );
    }

    //#region Methods

    onDropAccepted(acceptedFiles) {
        if (acceptedFiles.length != 1) return;
        this.state.track.path = acceptedFiles[0].path;
        this.state.track.title = acceptedFiles[0].title;
    }
    
    togglePlay() {
        if(this.state.playStatus === Sound.status.PLAYING){
            this.setState({playStatus: Sound.status.PAUSED})
        } else {
            this.setState({playStatus: Sound.status.PLAYING})
        }
    }

    toggleLoop() {
        var loop = document.getElementById("Loop");
        if (loop.classList.contains("off"))
        {
            loop.classList.remove("off");
            loop.classList.add("on");
        }
        else
        {
            loop.classList.remove("on");
            loop.classList.add("off");
        }
    }

    toggleMute() {
        var mute = document.getElementById("Mute");
        if (mute.classList.contains("fa-volume-up"))
        {
            mute.classList.remove("fa-volume-up");
            mute.classList.add("fa-volume-off");
        }
        else
        {
            mute.classList.remove("fa-volume-off");
            mute.classList.add("fa-volume-up");
        }
    }

    handleSongPlaying(audio) {
        this.setState(
        {  
            elapsed: this.formatMilliseconds(audio.position),
            total: this.formatMilliseconds(audio.duration),
            position: audio.position / audio.duration 
        });
      }
    
    handleSongFinished(audio) {
        alert("SONG FINISHED");
    }
    
    formatMilliseconds(milliseconds) {
        var hours = Math.floor(milliseconds / 3600000);
        milliseconds = milliseconds % 3600000;

        var minutes = Math.floor(milliseconds / 60000);
        milliseconds = milliseconds % 60000;

        var seconds = Math.floor(milliseconds / 1000);
        milliseconds = Math.floor(milliseconds % 1000);

        return (minutes < 10 ? '0' : '') + minutes + ':' +
        (seconds < 10 ? '0' : '') + seconds;
    }

    //#endRegion Methods
}

// Export AppContainer Component
export default AppContainer