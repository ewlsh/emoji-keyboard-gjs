const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;
const GLib = imports.gi.GLib;
const Lang = imports.lang;
const Atspi = imports.gi.Atspi;

const GdkPixbuf = imports.gi.GdkPixbuf;

const Provider = imports.provider;

const Key = new Lang.Class({
    Name: 'ek_Key',
    Extends: Gtk.Button,

    _init: function (emoji) {
        this.parent();
        // TODO: validate?
        this.emoji = emoji;
        //let label = new Gtk.Label({ label: emoji.to_string() });
        //label.set_markup("<span font=\"" + 16 + "\">" + emoji.to_string() + "</span>");
        this.set_size_request(16, 16);
        //this.child = label;
        //this.set_label("");
        // set_always_show_image ()
        // log(emoji.get_name());

        if (typeof emoji.get_name() === 'string')
            this.set_tooltip_text(emoji.get_name());
        else
            this.set_tooltip_text('unknown');
        try {
            let pixbuf = GdkPixbuf.Pixbuf.new_from_file('./images/twemoji/' + emoji.get_code_point().toLowerCase().substring(2) + '.svg');//, -1, -1);
            let image = new Gtk.Image();
            image.pixbuf = pixbuf;
            this.set_image(image);
        } catch (e) {
            let image = new Gtk.Image();
            this.set_image(image);
        }
        this.connect('clicked', Lang.bind(this, this._onClicked));
    },
    _onClicked: function (btn) {
        let child = btn.get_child();
        let text = this.emoji.to_string();

        Provider.get().insert(text);
    }
});