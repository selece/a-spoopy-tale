"use strict";

import { find, chain, map, filter, includes, isEqual } from "lodash";

import Loader from "./loader";
export default class ItemDB {
  constructor() {
    this.items = new Loader(
      ["skull.json", "tome.json", "amulet.json", "bottle.json", "pen.json"],
      "./data/items/"
      // path is relative to loader.js location!
    ).res;
  }

  item(search) {
    if (this.exists(search)) {
      return chain(this.items)
        .filter(item => item.name === search)
        .head()
        .value();
    } else {
      throw new Error(`Item does not exist: ${search}.`);
    }
  }

  get item_names() {
    return map(this.items, "name");
  }

  random_item(exclude = []) {
    return find(this.items, {
      name: chain(this.items)
        .map("name")
        .filter(item => !includes(exclude, item))
        .sampleSize()
        .head()
        .value()
    });
  }

  exists(search) {
    return find(this.items, { name: search }) !== undefined;
  }

  getDescription(search, conditions = {}) {
    const target = find(this.items, { name: search });
    if (target) {
      const filteredConditions = filter(target.descriptions, desc =>
        isEqual(desc.conditions, conditions)
      );

      if (filteredConditions.length) {
        return chain(filteredConditions)
          .sampleSize()
          .head()
          .value().text;
      } else {
        return chain(target.descriptions)
          .filter(desc => isEqual(desc.conditions, {}))
          .sampleSize()
          .head()
          .value().text;
      }
    } else {
      throw new Error(`Item not found: ${search}.`);
    }
  }
}
