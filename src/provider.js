const Lang = imports.lang;
const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;
const Wnck = imports.gi.Wnck;
const Atspi = imports.gi.Atspi;

const GLib = imports.gi.GLib;

const Provider = new Lang.Class({
    Name: 'ek_Provider',

    insert: function (str) { }
});

const ClipboardProvider = new Lang.Class({
    Name: 'ek_ClipboardProvider',
    Extends: Provider,

    insert: function (str) {
        this.parent();

        let clipboard = Gtk.Clipboard.get_default(Gdk.Display.get_default());

        if (clipboard != null) {
            clipboard.set_text(str, -1);

            if (true || Settings.attempt_auto_paste()) {
                let paste_command = "ctrl+v"//get_keyboard_settings().paste_command;
                let window = Wnck.Screen.get_default().get_active_window();
                if (window != null) {
                    //search --onlyvisible --name "' + window.get_name() + '" windowfocus
                    let command = 'xdotool getactivewindow key "' + paste_command + '"';
                    //log(command);
                    GLib.spawn_command_line_async(command);

                }// log(command);
               // Atspi.generate_keyboard_event(0, '<ctrl>v', Atspi.KeySynthType.SYM);
            }
        } else {
            error("Could Not Access Gdk Selection Clipboard.");
        }
    }
});

const AtspiProvider = new Lang.Class({
    Name: 'ek_AtspiProvider',
    Extends: Provider,

    insert: function (str) {
        this.parent();
        let wrap = String.fromCharCode(8203);
        log('sent: ' + Atspi.generate_keyboard_event(0, wrap + text + ' ', Atspi.KeySynthType.STRING));
    }
});

/* provider methods */

function init() {
    //if (Settings.use_atspi()) {
    //    this.provider = new AtspiProvider();
    //} else {
    this.provider = new ClipboardProvider();
    //}
}

function get() {
    return this.provider;
}