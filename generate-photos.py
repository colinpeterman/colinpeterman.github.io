#!/usr/bin/env python3
"""
generate-photos.py — Phantom Photos
====================================
Run this script after adding photos to your images/ folders.
It scans the folders, reads image dimensions, and updates the JSON manifests.

For JSON files that already exist, the existing order is preserved —
only dimensions are refreshed and new files are appended at the end.
For new JSON files, photos are sorted alphabetically.

Usage:
  python3 generate-photos.py

Run from the root of the project folder (same level as index.html).
Requires Pillow: pip install Pillow
"""

import os
import json

try:
    from PIL import Image
    HAS_PILLOW = True
except ImportError:
    HAS_PILLOW = False
    print('  ⚠️  Pillow not found — install it for dimension support: pip install Pillow')

SUPPORTED = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}

def get_dimensions(filepath):
    if not HAS_PILLOW:
        return None, None
    try:
        with Image.open(filepath) as im:
            return im.width, im.height
    except Exception:
        return None, None

def scan_folder(folder_path, existing_json_path=None):
    """
    Scan folder for images. If existing_json_path exists, preserve that order
    and only update dimensions / append new files.
    """
    if not os.path.isdir(folder_path):
        print(f'  Folder not found: {folder_path} — skipping.')
        return []

    disk_files = set(
        f for f in os.listdir(folder_path)
        if os.path.splitext(f)[1].lower() in SUPPORTED
    )

    # Load existing order if JSON already exists
    existing_order = []
    if existing_json_path and os.path.exists(existing_json_path):
        try:
            with open(existing_json_path) as fp:
                data = json.load(fp)
            existing_order = [e['file'] if isinstance(e, dict) else e for e in data]
        except Exception:
            pass

    # Keep existing files in their current order
    result = []
    seen = set()
    for filename in existing_order:
        if filename in disk_files:
            w, h = get_dimensions(os.path.join(folder_path, filename))
            entry = {'file': filename}
            if w and h:
                entry['w'] = w
                entry['h'] = h
            result.append(entry)
            seen.add(filename)

    # Append any brand new files not in the existing JSON
    for filename in sorted(disk_files - seen):
        w, h = get_dimensions(os.path.join(folder_path, filename))
        entry = {'file': filename}
        if w and h:
            entry['w'] = w
            entry['h'] = h
        result.append(entry)

    return result

def write_json(output_path, entries):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as fp:
        json.dump(entries, fp, indent=2)
    print(f'  Written {len(entries)} file(s) → {output_path}')

if __name__ == '__main__':
    print('\n📷 Phantom Photos — Photo Manifest Generator\n')

    sports = scan_folder('images/sports', 'data/sports.json')
    write_json('data/sports.json', sports)

    licensing = scan_folder('images/licensing', 'data/licensing.json')
    write_json('data/licensing.json', licensing)

    main = scan_folder('images/main', 'data/main.json')
    write_json('data/main.json', main)

    print('\n✅ Done! Refresh your browser to see the updated galleries.\n')
