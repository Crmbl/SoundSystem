import React from 'react';
import Sound from 'react-sound';
import Waves from '../components/waves.component';
import Player from '../components/player.component';
import Handle from '../components/handle.component';
var d3 = require('d3');

class AppContainer extends React.Component {
    
    // TODO 
    //! Prendre en compte les .flac
    //// Mettre en place les waveforms
    //* Ajouter gooey effect sur waveforms
    //* Permettre de réduire dans le systray
    //* Supprimer le lien électron sur clic droit de l'icone
    //* Créer un installeur && optimiser (MSIX)

    constructor(props) {
        super(props);

        this.state = {
            track: {path: '', title: ''},
            playStatus: Sound.status.STOPPED,
            volume: 100,
            loop: false,
            analyser: null
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
            analyser: null
        });
    }

    bufferChange() {
        if (this.state.analyser != null) return;

        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var audioElement = soundManager.sounds[soundManager.soundIDs[0]]._a;
        var audioSrc = audioCtx.createMediaElementSource(audioElement);
        var analyser = audioCtx.createAnalyser();
        audioSrc.connect(analyser);
        audioSrc.connect(audioCtx.destination);
        this.setState({analyser: analyser});

        var array = new Uint8Array(125);
        var svg = d3.select("#Waves").append('svg').attr('height', '128').attr('width', '500').attr('id', 'Svg');
        var defs = svg.append('defs');
        var gradient = defs.append('linearGradient').attr('id', 'Gradient').attr('x1', '100%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
        gradient.append('stop').attr('offset', '0%').attr('stop-color', '#e0c3fc');
        gradient.append('stop').attr('offset', '100%').attr('stop-color', '#8ec5fc');
        var filter = defs.append('filter').attr('id', 'GooFilter');
        filter.append('feGaussionBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '10').attr('result', 'blur');
        filter.append('feColorMatrix').attr('in', 'SourceGraphic').attr('mode', 'matrix').attr('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9').attr('result', 'goo');
        filter.append('feComposite').attr('in', 'SourceGraphic').attr('in2', 'goo').attr('operator', 'atop');

        svg.selectAll('rect').data(array).enter()
            .append('rect')
            .attr('x', function(d, i) { return i * (500 / array.length); })
            .attr('width', 500 / array.length)
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

        var array = new Uint8Array(125);
        this.state.analyser.getByteFrequencyData(array);
        var svg = d3.select("#Svg");
        svg.selectAll('rect')
            .data(array)
            .attr('y', function(d) {
                return 128 - d /2;
            })
            .attr('height', function(d) {
                return d / 2;
            })
            .attr('fill', function(d) {
                return "url(#Gradient)";
            });
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
                playStatus: Sound.status.STOPPED,
                analyser: null
            });

            d3.select('#Svg').remove();
        }
    }

    //#endRegion Methods
}

export default AppContainer