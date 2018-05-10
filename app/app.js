import React from 'react';
import ReactDOM from 'react-dom';
import Waves from './components/waves.component';
import Player from './components/player.component';

class App extends React.Component {
    render() {
        return (
             <Waves />,
             <Player />
        );
    }
}

ReactDOM.render( < App / > ,
    document.getElementById('content')
);