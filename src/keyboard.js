const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;
const GLib = imports.gi.GLib;
const Lang = imports.lang;
const Atspi = imports.gi.Atspi;

const Key = imports.key;
const Provider = imports.provider;

const Params = imports.params;
const Util = imports.util;

const Keybinder = imports.gi.Keybinder;

const Keyboard = new Lang.Class({
    Name: 'ek_EmojiKeyboard',
    Extends: Gtk.ApplicationWindow,

    column_spacing: 10,
    row_spacing: 10,
    right_click_menu: null,

    _init: function (params) {
        params = Params.fill(params, {
            title: GLib.get_application_name(),
            default_width: 400,
            default_height: 300
        });
        this.parent(params);

        Util.initActions(this,
            [{
                name: 'about',
                activate: this._about
            }]);

        //this.set_type_hint(Gdk.WindowTypeHint.MENU);
        this.set_title("");
        this.set_accept_focus(false);
        //   this.set_decorated(title_bar);
        //    this.set_opacity(opacity);
        this.categories = new Gtk.Notebook();
        this.emoji_sets = [];
        //let enum_class = (EnumClass) typeof (PositionType).class_ref ();
        //this.categories.set_tab_pos((PositionType) enum_class.get_value(menu_position).value);
        this.categories.set_show_border(false);
        //let head = new Gtk.HeaderBar();
        //head.add(this.categories);
        this.add(this.categories);
        //  log('iv');
        //   this.right_click_menu = new Gtk.Menu();
        //  log('jo');

        Keybinder.init();
        Keybinder.bind("<Ctrl><Alt>space", Lang.bind(this, this._keybinding), null);

    },
    _about: function () {
        let aboutDialog = new Gtk.AboutDialog(
            {
                authors: ['rockon999 <rockon999@users.noreply.github.com>'],
                translator_credits: _("translator-credits"),
                program_name: _("EmojiKeyboard"),
                comments: _("A GTK-based keyboard for Emoji"),
                copyright: 'Copyright 2016 The EmojiKeyboard developers',
                license_type: Gtk.License.GPL_2_0,
                logo_icon_name: pkg.name,
                version: pkg.version,
                website: 'https://www.github.com/rockon999/emoji-keyboard/',
                wrap_license: true,
                modal: true,
                transient_for: this
            });

        aboutDialog.show();
        aboutDialog.connect('response', function () {
            aboutDialog.destroy();
        });
    },
    _keybinding: function () {
        this.set_visible(!this.is_visible());
    },
    display_keyboard: function (x, y) {
        this.show_all();
        this.move(x, y);
    },
    show_all: function () {
        this.parent();
        this.set_keep_above(true);
        this.get_window().set_decorations(Gdk.WMDecoration.BORDER);
    },
    show: function () {
        this.parent();
        this.set_keep_above(true);
        this.get_window().set_decorations(Gdk.WMDecoration.BORDER);
    },
    set_visible: function (visible) {
        this.parent(visible);

        if (visible) {
            this.set_keep_above(true);
            this.get_window().set_decorations(Gdk.WMDecoration.BORDER);
        }
    },
    show_children: function () {
        this.categories.show_all();
    },
    add_emoji_set: function (emoji_set) {
        this.emoji_sets.push(emoji_set);
    },
    setup_categories: function () {
        while (this.categories.get_n_pages() > 0) {
            this.categories.remove_page(0);
        }

        for (let emoji_set of this.emoji_sets) {
            if (emoji_set == null) {
                continue;
            }

            let tab_child = new Gtk.Label({ label: '' });

            tab_child.set_markup("<span font=\"" + 16 + "\">" + emoji_set.get_title() + "</span>");

            let scrolling = new Gtk.ScrolledWindow({
                vscrollbar_policy: Gtk.PolicyType.AUTOMATIC,
                hscrollbar_policy: Gtk.PolicyType.NEVER,
                hexpand: true
            });

            let box = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL,
                spacing: this.row_spacing,
                homogeneous: true,
                margin_left: 10,
                margin_top: 10,
                margin_bottom: 10,
                margin_right: 10
            });

            let btn_box = new Gtk.Box({
                orientation: Gtk.Orientation.HORIZONTAL,
                spacing: this.column_spacing,
                homogeneous: true
            });

            for (let emoji of emoji_set.get_emojis()) {
                if (btn_box.get_children().length >= 5) {
                    box.add(btn_box);
                    btn_box = new Gtk.Box({
                        orientation: Gtk.Orientation.HORIZONTAL,
                        spacing: this.column_spacing,
                        homogeneous: true
                    });
                }

                if (emoji != null) {
                    btn_box.pack_start(new Key.Key(emoji), false, false, 0);
                }
            }

            scrolling.add(box);

            this.categories.append_page(scrolling, tab_child);
            this.categories.child_set_property(scrolling, "tab-expand", true);
        }

        let tab_child = new Gtk.Label({ label: '⚙' });//Gtk.Image.new_from_icon_name('emblem-system-symbolic', 16);

        tab_child.set_markup("<span font=\"" + 16 + "\">" + '⚙' + "</span>");

        let grid = Gtk.Builder.new_from_resource('/com/evanwelsh/EmojiKeyboard/prefs.ui').get_object('main');
        this.categories.append_page(grid, tab_child);
    }

});