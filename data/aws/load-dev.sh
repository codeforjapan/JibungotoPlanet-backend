# delete data
../venv/bin/dynamodb-csv --truncate -t devJibungotoPlanetfootprint
../venv/bin/dynamodb-csv --truncate -t devJibungotoPlanetparameter
../venv/bin/dynamodb-csv --truncate -t devJibungotoPlanetoption
# upload data
../venv/bin/dynamodb-csv -i -t devJibungotoPlanetfootprint -f ../footprint.csv
../venv/bin/dynamodb-csv -i -t devJibungotoPlanetparameter -f ../parameter.csv
../venv/bin/dynamodb-csv -i -t devJibungotoPlanetoption -f ../option.csv
