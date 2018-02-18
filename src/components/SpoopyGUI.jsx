import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {generate} from 'shortid';

@observer
class SpoopyGUIPlayerLocation extends Component {
    render() {
        return (
            <div>
                <h1>{this.props.info.current.loc}</h1>
            </div>
        );
    }
}

@observer
class SpoopyGUIPlayerLocationDescription extends Component {
    render() {
        return (
            <p className='description'>{this.props.info.current.desc}</p>
        );
    }
}

@observer
class SpoopyGUIPlayerLocationExitButton extends Component {
    render() {
        return (
            <div className='cursor-pointer nav-button'
                onClick={this.onClickHandler}
                onMouseEnter={this.onMouseEnterHandler}
                onMouseLeave={this.onMouseLeaveHandler}
            >

                <p>{this.props.display}</p>
            </div>
        );
    }

    onClickHandler = () => {
        this.props.engine.playerMove(this.props.exit);
    }

    onMouseEnterHandler = () => {
        console.log('You are hovering', this.props.exit);
    }

    onMouseLeaveHandler = () => {
        console.log('You stopped hovering', this.props.exit);
    }
}

@observer
class SpoopyGUIPlayerLocationExits extends Component {
    render() {
        const engine = this.props.engine;
        const exits = this.props.info.exits;

        return (
            <div>
                {
                    exits.map(
                        (elem, idx) => 
                            <SpoopyGUIPlayerLocationExitButton 
                                display={elem.display}
                                exit={elem.loc}
                                engine={engine}
                                key={generate()}
                            />
                    )
                }
            </div>
        );
    }
}

@observer
export default class SpoopyGUI extends Component {
    render() {
        const engine = this.props.engine;
        const info = engine.playerLocationInfo;

        return (
            <div className='gui center'>
                <SpoopyGUIPlayerLocation info={info} />
                <SpoopyGUIPlayerLocationDescription info={info} />
                <SpoopyGUIPlayerLocationExits engine={engine} info={info} />
            </div>
        );
    }
}