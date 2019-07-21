import { includes, keys } from 'lodash';
import { action, observable } from 'mobx';

import Player from './player';
import ItemDB from './items';
import RoomDB from './rooms';
import EventManager from './eventmanager';
import MapManager from './mapmanager';

export default class Engine {
  constructor(params) {
    this.player = new Player();
    this.itemDB = new ItemDB();
    this.roomDB = new RoomDB();

    this.eventManager = new EventManager();
    this.mapManager = new MapManager(this.roomDB.roomsByName, this.itemDB);

    // slightly ugly non-decorator due to mobx only tracking object props that exist
    // when the object is declared
    // see: extendObservable() or observable.map() for dynamic properties
    this.GUIState = observable({
      propDescription: undefined,
      propLocation: undefined,
      propButtonGridActions: undefined,
      propButtonGridExits: undefined,
      propHealth: undefined,
      propInventory: undefined,
      propBattery: undefined,
      propClock: undefined
    });

    // set up our managers with game startup events, seeds etc.
    this.eventManager.add([
      // end of game event, occurs 60 minutes after start
      {
        name: 'Global',
        timer: 60 * 60,
        trigger: () => this.endGame(),
        repeats: false,
        startPaused: false
      }
    ]);

    this.mapManager.generate(params);

    // map player actions for playerAction()
    this.playerActions = {
      PLAYER_MOVE: ({ loc, last }) => {
        this.player.move(loc, last);
      },

      PLAYER_EXPLORE: ({ loc }) => {
        this.player.explore(loc);
      },

      PLAYER_SEARCH: ({ loc }) => {
        this.player.search(loc);
      },

      PLAYER_PICKUP: ({ item, loc }) => {
        this.player.pickup(item);
        this.mapManager.pickup(item, loc);
      },

      PLAYER_DROP: ({ item, loc }) => {
        this.player.drop(item);
        this.mapManager.place(item, loc);
      }
    };

    // refresh gui state for game start
    this.updateGUIState();
  }

  endGame() {
    // TODO: implement endgame sequence, update GUI etc.
    this.player = undefined;
  }

  generateUIElement({ type, func }) {
  }

  updateGUIState() {
    // generate props for button grids (exits and actions)
    // const status = this.player.status;
    const {
      loc: { value: here },
      last: { value: last }
    } = this.player.status;

    // const here = status.loc.value;
    // const last = status.last.value;
    const room = this.mapManager.find(here);
    const hasExplored = this.player.query({ hasExplored: here });
    const hasSearched = this.player.query({ hasSearched: here });

    let propButtonGridActions;
    let propButtonGridExits;

    // TODO: make common buttons constants, push to appropriate array as req'd
    // TODO: refactor if/else structure to be less repetitive below

    // completely new room (not explored, not searched)
    if (!hasExplored && !hasSearched) {
      propButtonGridExits = [{}];

      propButtonGridActions = [
        {
          display: 'Take a look around.',
          classes: ['button-small', 'cursor-pointer'],
          onClickHandler: () =>
            this.playerAction('PLAYER_EXPLORE', {
              loc: here
            })
        }
      ];

      // explored room, but NOT searched (should see exits, but no items)
    } else if (hasExplored && !hasSearched) {
      propButtonGridExits = room.adjacency.map(exit => ({
        display: this.player.query({
          hasVisited: exit
        })
          ? exit
          : this.roomDB.randomUnexplored,
        classes: this.player.query({
          hasVisited: exit
        })
          ? ['button-large', 'cursor-pointer']
          : ['button-large', 'cursor-pointer', 'text-italics'],
        onClickHandler: () =>
          this.playerAction('PLAYER_MOVE', {
            loc: exit,
            last: here
          })
      }));

      propButtonGridActions = [
        {
          display: 'Search the room.',
          classes: ['button-small', 'cursor-pointer'],
          onClickHandler: () =>
            this.playerAction('PLAYER_SEARCH', {
              loc: here
            })
        }
      ];

      // explored room and searched room - should display items and exits
      // a bit of repeat code for propButtonGridExits - maybe refactor?
    } else if (hasExplored && hasSearched) {
      propButtonGridExits = room.adjacency.map(exit => ({
        display: this.player.hasVisited(exit)
          ? exit
          : this.roomDB.randomUnexplored,
        classes: ['button-large', 'cursor-pointer'],
        onClickHandler: () =>
          this.playerAction('PLAYER_MOVE', {
            loc: exit,
            last: here
          })
      }));

      propButtonGridActions = room.items.length
        ? room.items.map(item => ({
            display: item.name,
            classes: ['button-small', 'cursor-pointer'],
            onClickHandler: () =>
              this.playerAction('PLAYER_PICKUP', {
                item,
                loc: here
              })
          })) // no items, show nothing here to find
        : [
            {
              display: "There's nothing more here to find.",
              classes: ['button-small']
            }
          ];
    } else {
      throw new Error(
        `Unexpected exploration/search case! @ ${here} w/ ${room}.`
      );
    }

    // if we have a last location, add a button to go back
    if (last) {
      propButtonGridActions.push({
        display: 'Go back from where you came.',
        classes: ['button-small', 'cursor-pointer'],
        onClickHandler: () =>
          this.playerAction('PLAYER_MOVE', {
            loc: last,
            last: here
          })
      });
    }

    const {
      loc: { value: propLocation },
      health: { descriptive: propHealth },
      inventory: { descriptive: propInventory },
      battery: { descriptive: propBattery }
    } = this.player.status;
    // this.GUIState.propLocation = status.loc.value;
    this.GUIState.propLocation = propLocation;

    // TODO: more unexplored status statements (array, select random phrase)
    this.GUIState.propDescription = this.player.query({
      // hasExplored: status.loc.value
      hasExplored: propLocation
    })
      ? // ? this.roomDB.getDescription(status.loc.value)
        this.roomDB.getDescription(propLocation)
      : "You can't really make out too much standing here.";

    this.GUIState.propButtonGridActions = propButtonGridActions;
    this.GUIState.propButtonGridExits = propButtonGridExits;
    // this.GUIState.propHealth = status.health.descriptive;
    // this.GUIState.propInventory = status.inventory.descriptive;
    // this.GUIState.propBattery = status.battery.descriptive;
    this.GUIState.propHealth = propHealth;
    this.GUIState.propInventory = propInventory;
    this.GUIState.propBattery = propBattery;
  }

  @action
  playerAction(target, arg) {
    if (!includes(keys(this.playerActions), target)) {
      throw new Error(`"${action}" is not a valid action.`);
    }

    if (typeof arg !== 'object' || arg === undefined || arg === null) {
      throw new Error(`${arg} is not a valid parameter.`);
    }

    this.playerActions[target](arg);
    this.updateGUIState();
  }
}
