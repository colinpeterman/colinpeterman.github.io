#!/usr/bin/env python3
"""
generate-photos.py — Phantom Photos
====================================
Run this script after adding photos to your images/sports/ or images/licensing/ folders.
It scans the folders and updates data/sports.json and data/licensing.json automatically.

Usage:
  python3 generate-photos.py

Run from the root of the project folder (same level as index.html).
"""

import os
import json

SUPPORTED = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}

def scan_folder(folder_path):
    if not os.path.isdir(folder_path):
        print(f'  Folder not found: {folder_path} — skipping.')
        return []
    files = sorted([
        f for f in os.listdir(folder_path)
        if os.path.splitext(f)[1].lower() in SUPPORTED
    ])
    return files

def write_json(output_path, files):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as fp:
        json.dump(files, fp, indent=2)
    print(f'  Written {len(files)} file(s) → {output_path}')

if __name__ == '__main__':
    print('\n📷 Phantom Photos — Photo Manifest Generator\n')

    sports = scan_folder('images/sports')
    write_json('data/sports.json', sports)

    licensing = scan_folder('images/licensing')
    write_json('data/licensing.json', licensing)

    print('\n✅ Done! Refresh your browser to see the updated galleries.\n')