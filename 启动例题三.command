#!/bin/zsh
cd "${0:A:h}"
if [ ! -x .venv/bin/python ]; then
  python3 -m venv .venv
  .venv/bin/pip install -r requirements.txt || exit 1
fi
open http://127.0.0.1:8767
.venv/bin/python -m application.server
