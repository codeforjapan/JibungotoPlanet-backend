./venv/bin/dynamodb-csv -i -t FootprintTable -f footprint.csv
./venv/bin/dynamodb-csv -i -t ParameterTable -f parameter.csv
./venv/bin/dynamodb-csv -i -t OptionTable -f option.csv
./venv/bin/dynamodb-csv -i -t OptionIntensityRateTable -f optionIntensityRate.csv