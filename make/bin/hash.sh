# Setup variables
file=$(basename "$1")
dir=$(dirname "$1")

# Generate a hash of the file contents
hash=$(openssl sha1 "$dir/$file" | tail -c 8)

if [ -z "$hash" ]; then
    echo "Hash could not be generated" 1>&2
    exit 1
fi

# Rename file to include hash
mv "$dir/$file" "$dir/$hash.$file"

echo "$hash"
