export default class Loader {
    constructor(files, path) {
        this.path = path;
        this.files = files;
        this.loaded = [];

        for (let file of files) {
            console.log(`Loading ${file}...`);
            this.loaded.push(
                require(`${this.path}${file}`)
            );
        }
    }

    get res() {
        return this.loaded;
    }
}