
while getopts o:r:hg args; do
    case "$args" in 
        o)
            outdir=${OPTARG}
            ;;
        g)
            compile_gresource=true
            ;;
        r)
            gresource_file=${OPTARG}
            ;;
        ? | h)
            echo "\
Vibe plugin's automated release-build script.

help:
  'default': argument's default value, they're used if none are provided.

options:
  -g: enable gresource compilation
  -r \$file: gresource's target path (supports raw env, default: XDG_CONFIG_HOME/vibe/plugins/)
  -o \$path: build output path (default: \`./build/release\`)
  -h: show this help message"
            exit 0
            ;;
    esac
done


sh ./scripts/build.sh -o "${outdir:-./build/release}" \
    -r "${gresource_file:-/usr/share/vibe/resources.gresource}" \
    "$([[ "$compile_gresource" ]] && echo -n "-g")"

