#!/usr/bin/env bash
set -euo pipefail

FRONT_DIR="$(pwd)"
BACK_DIR="../backend-services"
BACK_PORT="${PORT:-4000}"

if [[ ! -d "$BACK_DIR" ]]; then
  echo "Missing $BACK_DIR. Run: bash scripts/macos/setup.sh"; exit 1
fi

pids=()
run() { (cd "$1" && eval "$2") & pids+=($!); }

# --- Start backend (simple heuristics) ---
if [[ -f "$BACK_DIR/package.json" ]] && grep -q '"dev"' "$BACK_DIR/package.json"; then
  run "$BACK_DIR" "PORT=$BACK_PORT npm run dev"
elif [[ -f "$BACK_DIR/pyproject.toml" || -f "$BACK_DIR/requirements.txt" ]]; then
  run "$BACK_DIR" "python3 -m uvicorn app:app --reload --port $BACK_PORT"
elif [[ -f "$BACK_DIR/pom.xml" || -f "$BACK_DIR/build.gradle" ]]; then
  if [[ -x "$BACK_DIR/mvnw" ]]; then
    run "$BACK_DIR" "./mvnw spring-boot:run"
  elif [[ -x "$BACK_DIR/gradlew" ]]; then
    run "$BACK_DIR" "./gradlew bootRun"
  else
    echo "Backend: start your Java dev server in $BACK_DIR (port $BACK_PORT)."
  fi
else
  echo "Backend: unknown stack. Start it manually in $BACK_DIR on port $BACK_PORT."
fi

# --- Start frontend (only if a dev script exists) ---
if [[ -f "$FRONT_DIR/package.json" ]] && grep -q '"dev"' "$FRONT_DIR/package.json"; then
  run "$FRONT_DIR" "npm run dev"
else
  echo "Frontend: no 'npm run dev' found; skipping."
fi

echo "Backend → http://localhost:$BACK_PORT"
echo "Frontend → check dev output for URL (e.g., http://localhost:3000 or :5173)"

cleanup() {
  echo; echo "Stopping..."
  for pid in "${pids[@]}"; do kill "$pid" 2>/dev/null || true; done
  wait || true
}
trap cleanup INT TERM
wait
