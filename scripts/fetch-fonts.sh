#!/bin/sh
# Rebuilds assets/fonts/*.woff2: Fraunces and Alegreya Sans cut down to what the site sets.
# Glyphs: ASCII, Romanian (ă â î ș ț, plus the cedilla forms), é, and the punctuation the copy uses („” ’ … – — · © « »).
# Axes: opsz 9–144 kept (optical sizes are part of the look), wght 360–400 (every weight DESIGN.md uses),
# SOFT pinned at 100 (every setting is SOFT 100), WONK 0 on roman and 0–1 on italic (the accent words).
# ponytail: a character outside this set falls back to Georgia; add it to CHARS and rerun when the CMS needs one.
set -e
cd "$(dirname "$0")/.."
TEXT=$(python3 -c "
import urllib.parse
chars=''.join(chr(c) for c in range(0x20,0x7f))+'ÂâÎîăĂșȘțȚşŞţŢ©·«»°éÉ€„”“’‘…–—\u00a0'
print(urllib.parse.quote(chars))")
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36"
get() {
  url=$(curl -s -A "$UA" "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@$1&display=swap&text=$TEXT" | grep -o 'https://[^)]*' | head -1)
  curl -s -o "assets/fonts/$2" "$url"
  echo "$2 $(wc -c < "assets/fonts/$2") bytes"
}
get "0,9..144,360..400,100,0" fraunces-roman.woff2
get "1,9..144,360..400,100,0..1" fraunces-italic.woff2

# Alegreya Sans, same glyph set, one file per weight/style the site uses (instead of latin + latin-ext pairs)
geta() {
  url=$(curl -s -A "$UA" "https://fonts.googleapis.com/css2?family=Alegreya+Sans:ital,wght@$1&display=swap&text=$TEXT" | grep -o 'https://[^)]*' | head -1)
  curl -s -o "assets/fonts/$2" "$url"
  echo "$2 $(wc -c < "assets/fonts/$2") bytes"
}
geta "0,400" alegreya-400.woff2
geta "0,500" alegreya-500.woff2
geta "0,700" alegreya-700.woff2
geta "1,400" alegreya-400-italic.woff2
geta "1,500" alegreya-500-italic.woff2
