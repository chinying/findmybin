#!/bin/bash
cp scripts/new.json src/data/recyclingBins.json
cp scripts/ewaste.json src/data/ewaste.json
cp scripts/2ndhandgoods.json src/data/2ndhandgoods.json

python3 scripts/combine.py