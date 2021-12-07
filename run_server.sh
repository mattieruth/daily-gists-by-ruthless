#! /bin/bash
open "http://localhost:$@"
python3 -m http.server "$@"