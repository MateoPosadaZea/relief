#!/usr/bin/env bash
# Publica el sitio. Cloudflare Pages compila solo al recibir el push.
#   ./deploy.sh "mensaje"   → usa ese mensaje
#   ./deploy.sh             → usa la fecha
set -euo pipefail

cd "$(dirname "$0")"
mensaje="${1:-$(date '+%Y-%m-%d %H:%M')}"

git add -A
if git diff --cached --quiet; then
  echo "Nada que publicar."
  exit 0
fi
git commit -m "$mensaje"
git push
echo "Publicado: $mensaje"
