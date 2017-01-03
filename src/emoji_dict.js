const Lang = imports.lang;
const Gio = imports.gi.Gio;
const Emoji = imports.emoji;
const GObject = imports.gi.GObject;
const Signals = imports.signals;

const _EmojiDict = new Lang.Class({
    Name: 'ek_EmojiDict',
    Extends: GObject.Object,

    _init: function (file_path) {
        this.dictionary = [];
        this.path = file_path;

    },
    load: function () {
        let file = Gio.File.new_for_path(this.path);
        file.load_contents_async(null, Lang.bind(this, function (file, result) {
            let [success, contents, tag] = file.load_contents_finish(result);

            let json = JSON.parse(contents);

            for (let emoji of json['emojis']) {
                // Need to fix multiple code emojis (skin tones, etc.)
                if (typeof emoji.code === 'string') {
                    let emoji_obj = new Emoji.Emoji({ code: parseInt(emoji.code), code_point: emoji.code, string: emoji.chars, name: emoji.name, keywords: emoji.keywords });
                    this.dictionary.push(emoji_obj);
                }
            }

            this.emit('dict-done');
        }));
    },
    get: function () {
        return this.dictionary;
    }
});
Signals.addSignalMethods(_EmojiDict.prototype);

let dictionary = null;

function init(file_path, callback) {
    dictionary = new _EmojiDict(file_path);
    dictionary.connect('dict-done', callback);
    dictionary.load();
}

