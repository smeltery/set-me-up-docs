#!/usr/bin/env python3
"""Bound authored files; upstream and generated files have separate checks."""
import json
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parent.parent
upstream = json.loads((root / "site/upstream.json").read_text())["files"]
files = subprocess.check_output(
    ["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    cwd=root,
).decode().split("\0")
failures = []
checked = 0
for name in set(files):
    path = root / name
    if not path.is_file() or path.suffix not in {
        ".md", ".mdx", ".sh", ".py", ".ts", ".tsx", ".mjs", ".toml", ".yml", ".yaml"
    }:
        continue
    if name.startswith(("site/content/docs/", "site/content-data/")):
        continue
    if name.removeprefix("site/") in upstream:
        continue
    checked += 1
    lines = len(path.read_text().splitlines())
    if lines > 400:
        failures.append(f"{name}: {lines} lines exceeds 400")
if failures:
    raise SystemExit("\n".join(failures))
print(f"OK line budget ({checked} authored files; 400 lines each)")
