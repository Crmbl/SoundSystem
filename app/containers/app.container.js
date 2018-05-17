import React from 'react';
import Sound from 'react-sound';
import Waves from '../components/waves.component';
import Player from '../components/player.component';
import Handle from '../components/handle.component';

class AppContainer extends React.Component {
    
    // TODO 
    //! Prendre en compte les .flac
    //* Mettre en place les waveforms
    //* Permettre de réduire dans le systray
    //* Créer un installeur
    //* Supprimer le lien électron sur clic droit de l'icone

    constructor(props) {
        super(props);

        this.state = {
            track: {path: '', title: ''},
            playStatus: Sound.status.STOPPED,
            volume: 100,
            loop: false,
            setAnalyser: false
        };

        soundManager.setup({
            html5PollingInterval: 1
            // debugMode: false
        });
    }

    render () {
        return (
            <div>
                <Waves />
                <Sound url={this.state.track.path}
                    onPlaying={this.handleSongPlaying.bind(this)}
                    onBufferChange={this.bufferChange.bind(this)}
                    onFinishedPlaying={this.handleSongFinished.bind(this)}
                    playStatus={this.state.playStatus}
                    volume={this.state.volume}
                    playFromPosition={this.state.playFromPosition} />
                <Player togglePlay={this.togglePlay.bind(this)}
                        onDropAccepted={this.onDropAccepted.bind(this)}
                        toggleLoop={this.toggleLoop.bind(this)}
                        toggleMute={this.toggleMute.bind(this)}
                        onInput={this.onInput.bind(this)} />
                <Handle />
            </div>
        );
    }

    //#region Methods

    onDropAccepted(acceptedFiles) {
        if (acceptedFiles.length != 1) return;

        var play = document.getElementById("Play");
        play.classList.remove("fa-play");
        if (!play.classList.contains("play-enabled"))
            play.classList.add("play-enabled");
        if (!play.classList.contains("fa-pause"))    
            play.classList.add("fa-pause");
        
        var mute = document.getElementById("Mute");
        mute.classList.remove("fa-volume-off");
        if (!mute.classList.contains("mute-enabled"))
            mute.classList.add("mute-enabled");
        if (!mute.classList.contains("fa-volume-up"))
            mute.classList.add("fa-volume-up");

        var progress = document.getElementById("ProgressSpan");
        progress.style.width = null;
        progress.classList.remove("drop-look");
        if (!progress.classList.contains("progress-look"))
            progress.classList.add("progress-look");

        var volume = document.getElementById("VolumeSlider");
        volume.value = 100;

        this.setState({
            volume: Number(volume.value), 
            track: {
                path: acceptedFiles[0].path, 
                title: acceptedFiles[0].title
            },
            position: 0,
            playStatus: Sound.status.PLAYING,
            setAnalyser: false
        });
    }

    bufferChange() {
        if (this.state.setAnalyser == true) return;

        this.setState({setAnalyser: true});
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var audioElement = soundManager.sounds[soundManager.soundIDs[0]]._a;
        var audioSrc = audioCtx.createMediaElementSource(audioElement);
        // var analyser = audioCtx.createAnalyser();

        // audioSrc.connect(analyser);
        // audioSrc.connect(audioCtx.destination);
    }
    
    togglePlay() {
        if (this.state.track.title == '') return;

        var play = document.getElementById("Play");
        if(this.state.playStatus === Sound.status.PLAYING){
            this.setState({playStatus: Sound.status.PAUSED});
            play.classList.remove("fa-pause");
            play.classList.add("fa-play");
        } else {
            this.setState({playStatus: Sound.status.PLAYING});
            play.classList.remove("fa-play");
            play.classList.add("fa-pause");
        }
    }

    toggleLoop() {
        if (this.state.track.title == '') return;

        var loop = document.getElementById("Loop");
        if (loop.classList.contains("off")) {
            this.setState({loop: true});
            loop.classList.remove("off");
            loop.classList.add("on");
        } else {
            this.setState({loop: false});
            loop.classList.remove("on");
            loop.classList.add("off");
        }
    }

    toggleMute() {
        if (this.state.track.title == '') return;

        var mute = document.getElementById("Mute");
        var volume = document.getElementById("VolumeSlider");
        if (mute.classList.contains("fa-volume-up")) {
            volume.value = 0;
            this.setState({volume: Number(volume.value)});
            mute.classList.remove("fa-volume-up");
            if (!mute.classList.contains("fa-volume-off"))
                mute.classList.add("fa-volume-off");
        } else {
            volume.value = 100;
            this.setState({volume: Number(volume.value)});
            mute.classList.remove("fa-volume-off");
            if (!mute.classList.contains("fa-volume-up"))
                mute.classList.add("fa-volume-up");
        }
    }

    onInput() {
        if (this.state.track.title == '') return;

        var volume = document.getElementById("VolumeSlider");
        var mute = document.getElementById("Mute");
        if (mute.classList.contains("fa-volume-off")) {
            mute.classList.remove("fa-volume-off");
            if (!mute.classList.contains("fa-volume-up"))
                mute.classList.add("fa-volume-up");
        }
        if (volume.value == 0) {
            mute.classList.remove("fa-volume-up");
            if (!mute.classList.add("fa-volume-off"))
                mute.classList.add("fa-volume-off");
        }

        this.setState({volume: Number(volume.value)});
    }

    handleSongPlaying(audio) {
        var progress = document.getElementById("ProgressSpan");
        progress.style.width = audio.position / audio.duration * 100 + '%';
    }
    
    handleSongFinished(audio) {
        var progress = document.getElementById("ProgressSpan");
        if (this.state.loop) {
            progress.style.width = null;
            this.setState({
                playStatus: Sound.status.PLAYING
            });
        } else {
            var mute = document.getElementById("Mute");
            var play = document.getElementById("Play");

            play.classList.remove("play-enabled");
            play.classList.remove("fa-pause");
            if (!play.classList.contains("fa-play"))
                play.classList.add("fa-play");

            mute.classList.remove("mute-enabled");
            mute.classList.remove("fa-volume-off");
            if (!mute.classList.contains("fa-volume-up"))
                mute.classList.add("fa-volume-up");

            progress.style.width = null;
            progress.classList.remove("progress-look");
            if (!progress.classList.contains("drop-look"))
                progress.classList.add("drop-look");

            this.setState({
                track: {path: '', title: ''},
                playStatus: Sound.status.STOPPED
            });
        }
    }

    //#endRegion Methods
}

export default AppContainer