"use strict";

export default class Loader {
  constructor(files, path) {
    this.path = path;
    this.files = files;
    this.loaded = [];

    // NOTE: currently, path is relative to loader.js location
    // TODO: make path absolute rather than relative?
    files.forEach(file => this.loaded.push(require(`${this.path}${file}`)));
  }

  get res() {
    return this.loaded;
  }
}
