#!/bin/sh
set -e

HF_BASE="https://huggingface.co"
CACHE_DIR="${TRANSFORMERS_CACHE:-.cache}"

download_model() {
  model=$1
  shift
  for file in "$@"; do
    dir="$CACHE_DIR/$model/$(dirname "$file")"
    mkdir -p "$dir"
    echo "Downloading $model/$file..."
    curl -sL "$HF_BASE/$model/resolve/main/$file" -o "$CACHE_DIR/$model/$file"
  done
}

COMMON_FILES="config.json tokenizer.json tokenizer_config.json special_tokens_map.json vocab.txt onnx/model_quantized.onnx"

download_model "Xenova/all-MiniLM-L6-v2" $COMMON_FILES
download_model "Xenova/bge-reranker-base" $COMMON_FILES

echo "All models downloaded to $CACHE_DIR"
