import React, {Component} from 'react';
import {observer} from 'mobx-react';

@observer
class SpoopyGUIPlayerLocation extends Component {
    render() {
        return (
            <h1>{this.props.loc}</h1>
        );
    }
}

@observer
class SpoopyGUIPlayerLocationDescription extends Component {
    render() {
        return (
            <p>{this.props.desc}</p>
        );
    }
}

@observer
class SpoopyGUIPlayerLocationExitButton extends Component {
    render() {
        return (
            <div onClick={this.onClickHandler}>
                <p>{this.props.display}</p>
            </div>
        );
    }

    onClickHandler = () => {
        this.props.engine.playerMove(this.props.exit);
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
                                display={engine.playerVisitedLocation(elem) ? elem : 'A mysterious cooridoor...'}
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
            <div>
                <SpoopyGUIPlayerLocation loc={engine.playerLocation} />
                <SpoopyGUIPlayerLocationDescription desc={engine.playerLocationDescription} />

                <hr />

                <SpoopyGUIPlayerLocationExits engine={engine} exits={engine.playerLocationExits} />
            </div>
        );
    }
}