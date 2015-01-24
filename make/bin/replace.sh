# Set up variables
replace="$1"
replace_with="$2"
in_file="${*:3}"

# Optionally update reference to the file
sed -E -i ".old" "s|$replace|$replace_with|" $in_file

for file in $in_file; do
    rm "$file.old"
done
