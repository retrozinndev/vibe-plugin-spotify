import Gio from "gi://Gio?version=2.0";

import { Plugin, Section } from "libvibe";
import { register } from "gnim/gobject";


// For Vibe to detect the plugin's code, its class must be implemented as `default`
// also, you may not change the plugin's class name, use the `name` prop instead.
// otherwise, Vibe won't detect the plugin!
@register() // register plugin in GObject
class VibePlugin extends Plugin {
    constructor() {
        super({
            name: "Vibe Plugin", // plugin name
            version: VIBE_PLUGIN_VERSION, // plugin version (retrieved from package.json automatically on compile-time, no need to change this)
            description: "A nice plugin for the Vibe Music Player!", // description of the plugin
            url: "https://github.com/retrozinndev/vibe-plugin", // url where you can get more info about the plugin(or its repo)
            implements: { // features that the plugin implement
                sections: true
            }
        });
    }

    // the sections feature should be implemented like this:
    getSections(_length?: number): Array<Section> | null {
        return [ // example sections
            {
                title: "Section 1",
                description: "This section is pretty nice!",
                headerButtons: [{
                    label: "See developer's website",
                    onClicked: () => Gio.Subprocess.new([
                        "xdg-open",
                        "https://retrozinndev.github.io"
                    ], Gio.SubprocessFlags.NONE)
                }]
            },
            {
                title: "Section 2",
                description: "Looking nice, section 2!!"
            }
        ];
    }
}


// register plugin on `window` object, so esbuild doesn't remove it
// this is development only: the final build won't have this line.
// @ts-ignore
window.plugin = VibePlugin;
