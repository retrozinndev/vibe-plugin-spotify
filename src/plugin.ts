import Gio from "gi://Gio?version=2.0";

import { Plugin, Section } from "libvibe";
import { register } from "gnim/gobject";
import { MaxInt, SpotifyApi } from "@spotify/web-api-ts-sdk";
import GLib from "gi://GLib?version=2.0";


/** Spotify Plugin for the Vibe Music Player
  * This is a plugin that allows(will allow) to stream
  * songs from the Spotify servers, and also managing playlists.
  * Jams and special online connection functions won't be 
  * implemented by the plugin, at least for now. */

@register()
class VibePlugin extends Plugin {
    #clientId = "23c3c810f05e4861b525995ef6b1e15c";
    #redirectUri = "http://127.0.0.1:1213";
    spotify!: SpotifyApi;
    locale: string = GLib.getenv("LANG") ?? GLib.getenv("LANGUAGE") ?? "en_US";

    constructor() {
        super({
            name: "Spotify",
            version: VIBE_PLUGIN_VERSION,
            description: "Spotify Account plugin for the Vibe Music Player",
            url: "https://github.com/retrozinndev/vibe-plugin-spotify",
            implements: {
                sections: true,
                search: true
            }
        });

        SpotifyApi.performUserAuthorization(
            this.#clientId,
            this.#redirectUri,
            [ "scope1" ],
            async (token) => {
                this.spotify = SpotifyApi.withAccessToken(this.#clientId, token);
            }, {}
        );
    }

    getSections(length?: MaxInt<50>): Array<Section> | null {
        return this.spotify.browse.getCategories(
            "BR", this.locale, length ?? 10, undefined
        );
    }
}


// @ts-ignore
window.plugin = VibePlugin;
