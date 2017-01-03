//const Main = imports.main;
const Params = imports.params;
const Lang = imports.lang;
const EmojiDict = imports.emoji_dict;


const EmojiSet = new Lang.Class({
    Name: 'ek_EmojiSet',

    _init: function(params) {
        params = Params.parse(params, { name: 'Emoji', title: 'EmojiKeyboard', emoji: [], description: '', order: -1 });

        this._name = params.name;
        this._title = params.title;
        this._order = params.order;
        this._raw_emoji = params.emoji;
        this.emoji = [];
    },
    load_emoji: function(path) {
        for (let emoji of EmojiDict.dictionary.get()) {
            if (emoji != null) {
                    let intersecting = this._raw_emoji.some(Lang.bind(this, function(v) {
                        return v === emoji.to_string();
                    }));
           
                    if (intersecting) {
                        this.emoji.push(emoji);
                    }
              
            }
        }
        if (this.emoji[0]) {
            this._title = this.emoji[0].to_string();
        }
    },
    get_emojis: function() {
        return this.emoji
    },
    get_title: function() {
        return this._title;
    },
    get_name: function() {
        return this._name;
    },
    get_order: function() {
        return this._order;
    }
});