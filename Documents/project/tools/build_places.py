#!/usr/bin/env python3
"""Builds frontend/places.json — every country, and the towns the "Where are
you from?" question offers — from open data, so nothing is typed by hand.

Sources
  Countries   i18n-iso-countries (npm, MIT): ISO 3166-1 names in English and
              Bulgarian.  langs/en.json, langs/bg.json
  Towns       GeoNames (https://www.geonames.org, CC BY 4.0):
                cities15000.txt        every place of 15,000 people or more
                BG.txt                 every place in Bulgaria
                alternatenames/BG.txt  their names in Bulgarian

Bulgaria gets every town and village GeoNames knows by a Bulgarian name (it
records a population for only a few hundred of them, so size cannot be the
test); other countries get their places of 15,000 or more. Anything not listed
can still be typed.

Usage
  python tools/build_places.py <folder with the files above>

The folder needs: en.json, bg.json, cities15000.txt, BG.txt, altBG.txt
(alternatenames/BG.zip unpacks to another BG.txt — rename it altBG.txt).
"""
import csv
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

# Populated places proper: towns, villages, and the seats of provinces and
# municipalities. Not city districts (PPLX), abandoned places (PPLQ), or
# localities such as huts and resorts (PPLL).
BG_KINDS = {"PPL", "PPLA", "PPLA2", "PPLA3", "PPLA4", "PPLC"}
OUT = Path(__file__).resolve().parent.parent / "frontend" / "places.json"
CYRILLIC = re.compile(r"^[А-Яа-яЁёЪъЬьЍѝ .\-„“]+$")


def rows(path):
    with open(path, encoding="utf-8", newline="") as f:
        yield from csv.reader(f, delimiter="\t", quoting=csv.QUOTE_NONE)


def main(src: Path) -> None:
    en = json.loads((src / "en.json").read_text(encoding="utf-8"))["countries"]
    bg = json.loads((src / "bg.json").read_text(encoding="utf-8"))["countries"]

    def one(name):  # some entries are [official, common]; the first is the usual one
        return name[0] if isinstance(name, list) else name

    countries = sorted(([code, one(en[code]), one(bg.get(code, en[code]))] for code in en),
                       key=lambda c: c[1])

    # geonames columns: 0 id, 1 name, 2 asciiname, 3 alternatenames, 6 feature
    # class, 7 feature code, 8 country, 14 population
    by_country = defaultdict(dict)
    for r in rows(src / "cities15000.txt"):
        name, country, population = r[1], r[8], int(r[14] or 0)
        if country == "BG" or not name:
            continue
        # the same name twice in one country: keep it once (the larger place)
        if population > by_country[country].get(name, -1):
            by_country[country][name] = population

    # Bulgarian names: prefer the one GeoNames marks as preferred, else any "bg"
    bg_names = {}
    for r in rows(src / "altBG.txt"):
        gid, lang, alt = r[1], r[2], r[3]
        preferred = len(r) > 4 and r[4] == "1"
        if lang == "bg" and CYRILLIC.match(alt) and (preferred or gid not in bg_names):
            bg_names[gid] = alt

    bulgaria = {}
    for r in rows(src / "BG.txt"):
        if r[6] != "P" or r[7] not in BG_KINDS:
            continue
        latin, local, population = r[1], bg_names.get(r[0]), int(r[14] or 0)
        if not local:
            continue
        key = (latin, local)
        if population > bulgaria.get(key, -1):
            bulgaria[key] = population

    cities = {code: [n for n, _ in sorted(places.items(), key=lambda kv: -kv[1])]
              for code, places in by_country.items()}
    # largest first, so the capital and the big towns lead the list
    # ...then the rest in alphabetical order of the Bulgarian name
    cities["BG"] = [[latin, local] for (latin, local), _ in
                    sorted(bulgaria.items(), key=lambda kv: (-kv[1], kv[0][1]))]

    data = {
        "source": "Countries: i18n-iso-countries (MIT). Towns: GeoNames, CC BY 4.0, https://www.geonames.org",
        "countries": countries,
        "cities": dict(sorted(cities.items())),
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    total = sum(len(v) for v in cities.values())
    print(f"{OUT.name}: {len(countries)} countries, {total} places "
          f"({len(cities['BG'])} in Bulgaria), {OUT.stat().st_size // 1024} KB")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(Path(sys.argv[1]))
