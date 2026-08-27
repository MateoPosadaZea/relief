#!/usr/bin/env bash
# Deploy de RELIEF — GitHub Pages publica solo desde la rama.
# Uso: ./deploy.sh "mensaje de commit"   (sin argumento usa un timestamp)
set -euo pipefail

cd "$(dirname "$0")"

MENSAJE="${1:-deploy $(date '+%Y-%m-%d %H:%M:%S')}"
RAMA="$(git rev-parse --abbrev-ref HEAD)"

git add -A

if git diff --cached --quiet; then
  echo "Sin cambios que commitear."
else
  git commit -m "$MENSAJE"
fi

git push -u origin "$RAMA"
echo "Listo: $RAMA"
