import { map, includes, without, keys } from 'lodash';

export default class Player {
  constructor() {
    this.loc = 'Foyer';
    this.last = undefined;
    this.inventory = [];
    this.map = [];
    this.explored = [];
    this.searched = [];
    this.health = 100;
    this.battery = 100;

    this.updateMap(this.loc);

    // condition resolver bindings
    this.conditionMap = {
      hasItem: arg => includes(map(this.inventory, 'name'), arg),
      atLocation: arg => this.loc === arg,
      lastAt: arg => this.last === arg,
      hasSearched: arg => this.hasSearched(arg),
      hasExplored: arg => this.hasExplored(arg),
      hasVisited: arg => this.hasVisited(arg),
      hasHealth: arg => this.health === arg,
      hasHealthGreaterThan: arg => this.health >= arg,
      hasHealthLessThan: arg => this.health <= arg,
      hasBattery: arg => this.battery === arg,
      hasBatteryGreaterThan: arg => this.battery >= arg,
      hasBatteryLessThan: arg => this.battery <= arg
    };
  }

  get status() {
    return {
      inventory: {
        descriptive: this.currentInventoryDescription,
        value: this.inventory
      },

      map: {
        value: this.map
      },

      explored: {
        value: this.explored
      },

      searched: {
        value: this.searched
      },

      health: {
        descriptive: this.currentHealthDescription,
        value: this.health
      },

      battery: {
        descriptive: this.currentBatteryDescription,
        value: this.battery
      },

      loc: {
        value: this.loc
      },

      last: {
        value: this.last
      },

      conditions: this.currentConditions
    };
  }

  get currentConditions() {
    const conditions = [];

    // current location condition
    conditions.push({ atLoc: this.loc });

    // current items in inventory
    this.inventory.forEach(item => {
      conditions.push({ hasItem: item.name });
    });

    return conditions;
  }

  get currentInventoryDescription() {
    // if the inventory is empty, return generic 'empty' response
    // TODO: have list of random phrases to randomly select from
    if (!this.inventory.length) {
      return 'Your pockets are quite empty.';

      // otherwise, build the response based on what we have right now
    }

    return `You are currently holding: ${this.inventory
      .map(
        // build the list for oxford comma correctness
        (item, index, list) => {
          // if the item starts with a vowel, prefix 'an', otherwise use 'a'
          const indefiniteArticle = includes(
            ['a', 'e', 'i', 'o', 'u'],
            String(item.name)
              .substring(0, 1)
              .toLowerCase()
          )
            ? 'an'
            : 'a';

          // if the list is exactly one item, return '<article> {item.name}'
          if (list.length === 1) {
            return `${indefiniteArticle} ${item.name}`;
          }

          // otherwise build comma-seperated list
          // if we're at the end of the list, return 'and <article> {item.name}'
          if (index === list.length - 1) {
            return `and ${indefiniteArticle} ${item.name}`;
          }

          // if the list is exactly two items, no oxford comma
          if (list.length === 2) {
            return `${indefiniteArticle} ${item.name} `;
          }

          // otherwise, add the oxford comma and continue
          return `${indefiniteArticle} ${item.name}, `;

          // NOTE: map returns an array - use join compact it into a single string
          // NOTE: no spaces in between the list items, already added above
        }
      )
      .join('')}.`;
  }

  get currentBatteryDescription() {
    if (this.battery === 100) {
      return "Your phone's battery is full.";
    }

    // TODO: finish descriptive outputs
    return 'Boop!';
  }

  get currentHealthDescription() {
    if (this.health === 100) {
      return 'You feel perfectly healthy.';
    }

    // TODO: finish descriptive outputs
    return 'Welp.';
  }

  modifyHealth(amount) {
    if (Number.parseFloat(amount) !== +amount) {
      throw new Error(`Expected number, got ${amount}.`);
    }

    this.health += amount;
    return this.health;
  }

  modifyBattery(amount) {
    if (Number.parseFloat(amount) !== +amount) {
      throw new Error(`Expected number, got ${amount}.`);
    }

    this.battery += amount;
    return this.battery;
  }

  pickup(item) {
    this.inventory.push(item);
  }

  drop(item) {
    if (this.hasItem(item)) {
      this.inventory = without(this.inventory, item);
    } else {
      throw new Error(`Player does not have ${item} to drop.`);
    }
  }

  hasItem(item) {
    return includes(this.inventory, item);
  }

  hasVisited(loc) {
    return includes(this.map, loc);
  }

  hasExplored(loc) {
    return includes(this.explored, loc);
  }

  hasSearched(loc) {
    return includes(this.searched, loc);
  }

  updateMap(loc) {
    if (!this.hasVisited(loc)) {
      this.map.push(loc);
    }
  }

  explore(loc) {
    if (!this.hasExplored(loc)) {
      this.explored.push(loc);
    }
  }

  search(loc) {
    if (!this.hasSearched(loc)) {
      this.searched.push(loc);
    }
  }

  move(loc, last = undefined) {
    this.updateMap(loc);
    this.loc = loc;
    this.last = last;
  }

  query(arg) {
    const res = [];

    Object.entries(arg).forEach(set => {
      const [key, val] = set;

      if (!includes(keys(this.conditionMap), key)) {
        throw new Error(`Invalid condition: ${key}.`);
      }

      res.push(this.conditionMap[key](val));
    });

    return res.every(elem => elem === true);
  }
}
