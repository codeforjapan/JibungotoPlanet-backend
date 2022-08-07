./venv/bin/dynamodb-csv --truncate -t FootprintTable
./venv/bin/dynamodb-csv --truncate -t ParameterTable
./venv/bin/dynamodb-csv --truncate -t OptionTable
# ./venv/bin/dynamodb-csv --truncate -t OptionIntensityRateTable

./venv/bin/dynamodb-csv -i -t FootprintTable -f footprint.csv
./venv/bin/dynamodb-csv -i -t ParameterTable -f parameter.csv
./venv/bin/dynamodb-csv -i -t OptionTable -f option.csv
# ./venv/bin/dynamodb-csv -i -t OptionIntensityRateTable -f optionIntensityRate.csv