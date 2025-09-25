set -e

output="./build"

while getopts r:o:dhg args; do
    case "$args" in
        r) 
            gresources_target=${OPTARG}
            ;;
        o)
            output=${OPTARG}
            ;;
        g)
            compile_gresource=true
            ;;
        d)
            is_devel=true
            ;;
        ? | h)
            echo "\
Vibe plugin's build script. 
Please use \`build:release\` for release builds.

options: 
  -r \$file: specify gresource's target path (supports raw env, default: \`\$output/resources.gresource\`)
  -o \$path: specify the build's output directory (default: \`./build\`)
  -g: enable gresource compilation
  -d: enable developer mode in the plugin
  -h: show this help message"
            exit 0
            ;;
    esac
done

if ! command -v esbuild > /dev/null 2>&1; then
    echo "[error] esbuild not found. please make sure that it's in your PATH" > /dev/stderr
    exit 1
fi

sh ./scripts/clean.sh $output

mkdir -p $output

# find project root from the $output directory
project_root="."
while [[ ! `ls -w1 "$output/$project_root"` =~ package.json|pnpm-lock.yaml ]]; do
    project_root="$project_root/.."
done


if [[ "$compile_gresource" ]]; then
    echo "[info] compiling gresource"
    glib-compile-resources resources.gresource.xml \
        --sourcedir . \
        --target "$output/resources.gresource"
fi

echo "[info] bundling plugin"
find ./src/*.ts | sed -e 's/.*/import "'${project_root//\//\\/}'\/&";/' > $output/concat.ts
esbuild --bundle $output/concat.ts \
    --outfile=$output/plugin.js \
    --source-root=src \
    --sourcemap=inline \
    --format="esm" \
    --target=firefox128 \
    --external:"gi://*" \
    --external:"resource://*" \
    --external:"console" \
    --external:"system" \
    --external:"gettext" \
    --external:"libvibe" \
    --external:"gnim" \
    --define:"DEVEL=`[[ $is_devel ]] && echo -n true || echo -n false`" \
    --define:"VIBE_PLUGIN_VERSION='`cat package.json | jq -r .version`'" \
    --define:"GRESOURCES_FILE='${gresources_target:-$output/resources.gresource}'" && \
  sed -i -E 's/(.*)window.plugin = VibePlugin;/\1/g' $output/plugin.js # remove dummy plugin reference
