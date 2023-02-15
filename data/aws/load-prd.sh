# delete data
../venv/bin/dynamodb-csv --truncate -t prdJibungotoPlanetfootprint
../venv/bin/dynamodb-csv --truncate -t prdJibungotoPlanetparameter
../venv/bin/dynamodb-csv --truncate -t prdJibungotoPlanetoption
# upload data
../venv/bin/dynamodb-csv -i -t prdJibungotoPlanetfootprint -f ../footprint.csv
../venv/bin/dynamodb-csv -i -t prdJibungotoPlanetparameter -f ../parameter.csv
../venv/bin/dynamodb-csv -i -t prdJibungotoPlanetoption -f ../option.csv
