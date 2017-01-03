pkg.initGettext();
pkg.initFormat();
pkg.require({
    'Gdk': '3.0',
    'Gio': '2.0',
    'GLib': '2.0',
    'GObject': '2.0',
    'Gtk': '3.0'
});

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

const Util = imports.util;

const Atspi = imports.gi.Atspi;
const Keyboard = imports.keyboard;

const EmojiDict = imports.emoji_dict;
const EmojiSet = imports.emoji_set;
const Emoji = imports.emoji;
const Provider = imports.provider;

function initEnvironment() {
    window.getApp = function () {
        return Gio.Application.get_default();
    };
}

const Application = new Lang.Class({
    Name: 'EmojiKeyboard',
    Extends: Gtk.Application,

    _init: function () {
        this.parent({
            application_id: pkg.name,
            //flags: pkg.appFlags
        });
        if (this.flags & Gio.ApplicationFlags.IS_SERVICE)
            this.inactivity_timeout = 60000;

        GLib.set_application_name(_("EmojiKeyboard"));

        Provider.init();
    },

    _onQuit: function () {
        this.quit();
    },

    _initAppMenu: function () {
        let builder = new Gtk.Builder();
        //builder.add_from_resource('/com/evanwelsh/EmojiKeyboard/app-menu.ui');

        //let menu = builder.get_object('app-menu');
        //this.set_app_menu(menu);
    },

    vfunc_startup: function () {
        this.parent();

        Util.loadStyleSheet('/com/evanwelsh/EmojiKeyboard/application.css');

        Util.initActions(this,
            [{
                name: 'quit',
                activate: this._onQuit
            }]);
        this._initAppMenu();
    },

    vfunc_activate: function () {
        initEnvironment();

        this.keyboard = new Keyboard.Keyboard({ application: this });

        EmojiDict.init('./emoji.json', Lang.bind(this, function () {
            let folder = Gio.File.new_for_path('./sets/');
            let enumerator = folder.enumerate_children("standard::*", Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, null);

            let info = null;
            let async = 0;

            while ((info = enumerator.next_file(null)) != null) {
                if (info.get_file_type() != Gio.FileType.DIRECTORY) {
                    let file = enumerator.get_child(info);

                    async++; file.load_contents_async(null, Lang.bind(this, function (file, result) {
                        let [success, contents, tag] = file.load_contents_finish(result);

                        let json = JSON.parse(contents);
                        let set = new EmojiSet.EmojiSet({ name: json.name, title: json.name, emoji: json.emoji, description: json.description });
                        set.load_emoji();

                        this.keyboard.add_emoji_set(set);

                        // This is the last file. Setup the categories.
                        if (--async === 0) {
                            this.keyboard.setup_categories();
                            this.keyboard.show_all();
                        }
                    }));
                }
            }


        }));

        let rootwin = this.keyboard.get_screen().get_root_window();
        let [x, y, mods] = rootwin.get_pointer();
        let [width, height] = this.keyboard.get_size();
        this.keyboard.display_keyboard(x + width + 20, y + height + 20);

    },

    vfunc_shutdown: function () {
        this.parent();
    },
    get_keyboard: function () {
        return this.keyboard;
    }
});


function main(argv) {
    initEnvironment();

    return (new Application()).run(argv);
}


