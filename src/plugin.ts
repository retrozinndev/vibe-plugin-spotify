import GLib from "gi://GLib?version=2.0";

import type { Section } from "libvibe";
import { register } from "gnim/gobject";
import { MaxInt, SpotifyApi } from "@spotify/web-api-ts-sdk";


const { Plugin } = libvibe;

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

    async getSections(length?: MaxInt<50>, offset?: number): Promise<Array<Section> | null> {
        return (await this.spotify.browse.getCategories(
            "BR", this.locale, length ?? 10, offset ?? 0
        )).categories.items.map((item) => ({
            title: item.name,
            type: "row",
            content: []
        } satisfies Section));
    }
}


// @ts-ignore
window.plugin = VibePlugin;
