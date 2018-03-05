export default class Loader {
    constructor(files, path) {
        this.path = path;
        this.files = files;
        this.loaded = [];

        // NOTE: currently, path is relative to loader.js location
        // TODO: make path absolute rather than relative?
        for (let file of files) {
            this.loaded.push(
                require(`${this.path}${file}`)
            );
        }
    }

    get res() {
        return this.loaded;
    }
}