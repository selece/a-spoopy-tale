import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Motion, spring} from 'react-motion'

@observer
class SpoopyGUIPlayerLocation extends Component {
    render() {
        return (
            <div>
                <h1>{this.props.loc}</h1>
                <Motion defaultStyle={{x: 0}} style={{x: spring(10)}}>
                    {value => <p>{value.x}</p>}
                </Motion>
            </div>
        );
    }
}

@observer
class SpoopyGUIPlayerLocationDescription extends Component {
    render() {
        return (
            <p className='description'>{this.props.desc}</p>
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
        const exits = this.props.exits;

        return (
            <div>
                {
                    exits.map(
                        (elem, idx) => 
                            <SpoopyGUIPlayerLocationExitButton 
                                display={engine.playerVisitedLocation(elem) ? elem : engine.randomUnexplored}
                                exit={elem}
                                engine={engine}
                                key={idx}
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

        return (
            <div className='gui center'>
                <SpoopyGUIPlayerLocation loc={engine.playerLocation} />
                <SpoopyGUIPlayerLocationDescription desc={engine.playerLocationDescription} />
                <SpoopyGUIPlayerLocationExits engine={engine} exits={engine.playerLocationExits} />
            </div>
        );
    }
}