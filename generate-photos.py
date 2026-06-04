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
CONVERT_TO_WEBP = {'.jpg', '.jpeg', '.png'}
WEBP_QUALITY = 82
THUMB_MAX = 800
THUMB_QUALITY = 72

def convert_to_webp(filepath):
    """Convert image to WebP alongside the original. Returns the new filename."""
    if not HAS_PILLOW:
        return os.path.basename(filepath)
    base, ext = os.path.splitext(filepath)
    if ext.lower() not in CONVERT_TO_WEBP:
        return os.path.basename(filepath)
    webp_path = base + '.webp'
    if not os.path.exists(webp_path):
        try:
            with Image.open(filepath) as im:
                im.save(webp_path, 'WEBP', quality=WEBP_QUALITY, method=6)
            original_kb = os.path.getsize(filepath) // 1024
            webp_kb = os.path.getsize(webp_path) // 1024
            print(f'    Converted {os.path.basename(filepath)} → .webp ({original_kb}KB → {webp_kb}KB)')
            os.remove(filepath)
        except Exception as e:
            print(f'    ⚠️  Could not convert {os.path.basename(filepath)}: {e}')
            return os.path.basename(filepath)
    return os.path.basename(webp_path)

def generate_thumbs(source_folder, entries):
    """Create thumbnails for all entries into a sibling _thumbs folder."""
    if not HAS_PILLOW:
        return
    thumb_folder = source_folder.rstrip('/').rstrip('\\') + '_thumbs'
    os.makedirs(thumb_folder, exist_ok=True)
    for entry in entries:
        filename = entry['file'] if isinstance(entry, dict) else entry
        src = os.path.join(source_folder, filename)
        dst = os.path.join(thumb_folder, filename)
        if os.path.exists(dst):
            continue
        try:
            with Image.open(src) as im:
                im.thumbnail((THUMB_MAX, THUMB_MAX), Image.LANCZOS)
                im.save(dst, 'WEBP', quality=THUMB_QUALITY, method=6)
            orig_kb = os.path.getsize(src) // 1024
            thumb_kb = os.path.getsize(dst) // 1024
            print(f'    Thumbnail {filename} ({orig_kb}KB → {thumb_kb}KB)')
        except Exception as e:
            print(f'    ⚠️  Could not thumbnail {filename}: {e}')

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

    all_files = set(
        f for f in os.listdir(folder_path)
        if os.path.splitext(f)[1].lower() in SUPPORTED
    )
    # Exclude original JPG/PNG if a WebP version already exists
    disk_files = set()
    for f in all_files:
        base, ext = os.path.splitext(f)
        if ext.lower() in CONVERT_TO_WEBP and (base + '.webp') in all_files:
            continue
        disk_files.add(f)

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
            webp_name = convert_to_webp(os.path.join(folder_path, filename))
            w, h = get_dimensions(os.path.join(folder_path, filename))
            entry = {'file': webp_name}
            if w and h:
                entry['w'] = w
                entry['h'] = h
            result.append(entry)
            seen.add(filename)

    # Append any brand new files not in the existing JSON
    for filename in sorted(disk_files - seen):
        webp_name = convert_to_webp(os.path.join(folder_path, filename))
        w, h = get_dimensions(os.path.join(folder_path, filename))
        entry = {'file': webp_name}
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
    generate_thumbs('images/sports', sports)

    licensing = scan_folder('images/licensing', 'data/licensing.json')
    write_json('data/licensing.json', licensing)
    generate_thumbs('images/licensing', licensing)

    main = scan_folder('images/main', 'data/main.json')
    write_json('data/main.json', main)

    print('\n✅ Done! Refresh your browser to see the updated galleries.\n')
