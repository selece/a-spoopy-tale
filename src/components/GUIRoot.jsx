import React from 'react';
import { observer } from 'mobx-react';

import PlayerInfo from './PlayerInfo/PlayerInfo.jsx';
import ButtonGrid from './ButtonGrid/ButtonGrid.jsx';

import './GUIRoot.scss';

@observer export default class GUIRoot extends React.Component {
    render() {
        const GUIState = this.props.GUIState;

        return (
            <div id='GUIRoot' className='center'>
                <PlayerInfo render={GUIState} />

                <ButtonGrid render={GUIState} renderName='propButtonGridActions' classes='button-grid' />
                <hr />
                <ButtonGrid render={GUIState} renderName='propButtonGridExits' classes='button-grid' />
            </div>
        );
    }
}