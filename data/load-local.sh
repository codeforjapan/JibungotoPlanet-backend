./venv/bin/dynamodb-csv --truncate -t localJibungotoPlanetfootprint
./venv/bin/dynamodb-csv --truncate -t localJibungotoPlanetparameter
./venv/bin/dynamodb-csv --truncate -t localJibungotoPlanetoption

./venv/bin/dynamodb-csv -i -t localJibungotoPlanetfootprint -f footprint.csv
./venv/bin/dynamodb-csv -i -t localJibungotoPlanetparameter -f parameter.csv
./venv/bin/dynamodb-csv -i -t localJibungotoPlanetoption -f option.csv
