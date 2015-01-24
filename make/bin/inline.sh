marker="[[INSERT]]"

replace="$1"
in_file="$2"
from_file="$3"

before="$4"
after="$5"

awk '{sub("'"$replace"'","'"$before"'\n'"$marker"'\n'"$after"'"); print}' < "$in_file" >> "$in_file.tmp"
mv "$in_file.tmp" "$in_file"
sed -i ".old" -e "/$marker/r $from_file" -e "/$marker/d" "$in_file"
rm "$in_file.old" "$from_file"
