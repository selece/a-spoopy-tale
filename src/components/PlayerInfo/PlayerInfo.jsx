import React from 'react';
import { observer } from 'mobx-react';
import AnimateOnChange from 'react-animate-on-change';

import DisplayHeader from '../Display/DisplayHeader/DisplayHeader.jsx';
import DisplayText from '../Display/DisplayText/DisplayText.jsx';

import './PlayerInfo.scss';

@observer
export default class PlayerInfo extends React.Component {
    render() {
        return (
            <AnimateOnChange
                baseClassName='player-info'
                animationClassName='player-info-anim'
                animate={this.props.render.animate}
            >
                <DisplayHeader 
                    render={this.props.render} 
                    renderName='propLocation' 
                    classes=''  
                />

                <DisplayText 
                    render={this.props.render} 
                    renderName='propDescription' 
                    classes=''  
                />

                <DisplayText 
                    render={this.props.render} 
                    renderName='propHealth' 
                    classes=''  
                />

                <DisplayText 
                    render={this.props.render} 
                    renderName='propInventory' 
                    classes=''  
                />
            </AnimateOnChange>
        );
    }
}