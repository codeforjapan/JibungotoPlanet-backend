# delete data
../venv/bin/dynamodb-csv --truncate -t Footprint-epwhhio5abgdthpzpwfkaox4ba-stg
../venv/bin/dynamodb-csv --truncate -t Parameter-epwhhio5abgdthpzpwfkaox4ba-stg
../venv/bin/dynamodb-csv --truncate -t Option-epwhhio5abgdthpzpwfkaox4ba-stg
# upload data
../venv/bin/dynamodb-csv -i -t Footprint-epwhhio5abgdthpzpwfkaox4ba-stg -f ../footprint.csv
../venv/bin/dynamodb-csv -i -t Parameter-epwhhio5abgdthpzpwfkaox4ba-stg -f ../parameter.csv
../venv/bin/dynamodb-csv -i -t Option-epwhhio5abgdthpzpwfkaox4ba-stg -f ../option.csv
