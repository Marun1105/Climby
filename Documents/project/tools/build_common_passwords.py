#!/usr/bin/env python3
"""Builds the list of passwords everyone already knows, for the server and
the app, from a published list — nothing is typed by hand.

Source: SecLists, Passwords/Common-Credentials/10k-most-common.txt
        (github.com/danielmiessler/SecLists, MIT). The ten thousand passwords
        seen most often in leaked data.

Only those of 8 characters or more are kept: anything shorter is refused by
the length rule before this list is ever consulted.

Usage:  python tools/build_common_passwords.py <10k-most-common.txt>
Writes: common_passwords.txt            (read by security.py)
        frontend/common-passwords.txt   (read by auth.js, for the live meter)
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MIN_LENGTH = 8

if len(sys.argv) != 2:
    sys.exit(__doc__)
words = sorted({w.strip().lower() for w in Path(sys.argv[1]).read_text(encoding="utf-8", errors="ignore").splitlines()
                if len(w.strip()) >= MIN_LENGTH})
text = "\n".join(words) + "\n"
for out in (ROOT / "common_passwords.txt", ROOT / "frontend" / "common-passwords.txt"):
    out.write_text(text, encoding="utf-8")
print(f"{len(words)} passwords of {MIN_LENGTH}+ characters, {len(text) // 1024} KB")
