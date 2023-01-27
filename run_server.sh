trap 'kill $BGPID; exit' INT
port=${1:-3050}
python3 -m http.server $port &
BGPID=$!
sleep 2
open "http://localhost:$port"
wait