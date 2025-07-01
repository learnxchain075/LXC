#!/bin/bash
# Download face-api models into the directory specified by FACE_MODEL_PATH
# or ./models by default.

set -e

MODEL_DIR="${FACE_MODEL_PATH:-./models}"
mkdir -p "$MODEL_DIR"
BASE_URL="https://github.com/vladmandic/face-api/raw/master/model"
FILES=(
  "face_recognition_model-weights_manifest.json"
  "face_recognition_model-shard1" \
  "face_landmark_68_model-weights_manifest.json"
  "face_landmark_68_model-shard1" \
  "ssd_mobilenetv1_model-weights_manifest.json"
  "ssd_mobilenetv1_model-shard1"
)

for FILE in "${FILES[@]}"; do
  echo "Downloading $FILE..."
  curl -L "$BASE_URL/$FILE" -o "$MODEL_DIR/$FILE"
  sleep 1
done

echo "Models downloaded to $MODEL_DIR"
