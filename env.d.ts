import * as Libvibe from "libvibe";

declare global {
    const VIBE_PLUGIN_VERSION: string;
    const DEVEL: boolean;
    const GRESOURCES_FILE: string;

    const libvibe: typeof Libvibe;
}
