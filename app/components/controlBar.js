import React, { Component } from 'react';
import styles from './Home.css';

export default class Home extends Component {
    constructor() {
        super();
        this.onCloseClick = this.onCloseClick.bind(this);
        this.onMenuClick = this.onMenuClick.bind(this);
    }

    onMenuClick() {
        alert('MENU');
    }

    onCloseClick() {
        alert('CLOSE');
    }

    render() {
        let className = styles.homeContainer;
        return (
            <div className={ className }>
                <div className={ styles.playerTitle }>
                    <div className={ styles.closeButton } onClick={this.onCloseClick}></div>
                    <div className={ styles.menuButton } onClick={this.onMenuClick}></div>
                </div>
            </div>
        );
    }
}