#!/bin/sh
# Rebuilds assets/fonts/*.woff2: Fraunces and Alegreya Sans cut down to what the site sets.
# Glyphs: ASCII, Romanian (ă â î ș ț, plus the cedilla forms), é, and the punctuation the copy uses („” ’ … – — · © « »).
# Axes: opsz 9–144 kept (optical sizes are part of the look), wght 360–400 (every weight DESIGN.md uses),
# SOFT pinned at 100 (every setting is SOFT 100), WONK 0 on roman and 0–1 on italic (the accent words).
# fraunces-og.ttf is the roman cut instanced at wght 380 / opsz 144 (SOFT 100 is already baked in) for next/og: Satori reads
# TTF/OTF/WOFF but not woff2. It is made from the woff2 above with fontTools in a throwaway venv (needs network for pip only).
# `sh scripts/fetch-fonts.sh og` rebuilds just that file and leaves the downloads alone.
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
if [ "$1" != og ]; then
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
fi

venv=$(mktemp -d)
trap 'rm -rf "$venv"' EXIT
python3 -m venv "$venv"
"$venv/bin/pip" -q --disable-pip-version-check install fonttools brotli
"$venv/bin/python" -I - <<'PY'
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
font = TTFont("assets/fonts/fraunces-roman.woff2")
pin = {"opsz": 144, "wght": 380, "SOFT": 100, "WONK": 0}
out = instancer.instantiateVariableFont(font, {a.axisTag: pin[a.axisTag] for a in font["fvar"].axes if a.axisTag in pin})
out.flavor = None
out.save("assets/fonts/fraunces-og.ttf")
PY
echo "fraunces-og.ttf $(wc -c < assets/fonts/fraunces-og.ttf) bytes"
