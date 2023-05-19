# delete data
../venv/bin/dynamodb-csv --truncate -t testJibungotoPlanetfootprint
../venv/bin/dynamodb-csv --truncate -t testJibungotoPlanetparameter
../venv/bin/dynamodb-csv --truncate -t testJibungotoPlanetoption
# upload data
../venv/bin/dynamodb-csv -i -t testJibungotoPlanetfootprint -f ../footprint.csv
../venv/bin/dynamodb-csv -i -t testJibungotoPlanetparameter -f ../parameter.csv
../venv/bin/dynamodb-csv -i -t testJibungotoPlanetoption -f ../option.csv
