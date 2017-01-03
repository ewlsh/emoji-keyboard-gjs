const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;
const GLib = imports.gi.GLib;
const Lang = imports.lang;
const Atspi = imports.gi.Atspi;
const Params = imports.params;

const Provider = imports.provider;

const Emoji = new Lang.Class({
    Name: 'ek_Emoji',

    _init: function (params) {
        params = Params.parse(params, { name: '', code: 0, code_point: '0x0000', string: '', keywords: [] });

        this._str = params.string;
        this.name = params.name;
        this.code = params.code;
        this.point = params.code_point;
        this.keywords = params.keywords;
    },
    to_string: function () {
        return this._str;
    },
    get_name: function () {
        return this.name;
    },
    get_code: function () {
        return this.code;
    },
    get_code_point: function () {
        return this.point;
    },
    get_keywords: function () {
        return this.keywords;
    }
});

