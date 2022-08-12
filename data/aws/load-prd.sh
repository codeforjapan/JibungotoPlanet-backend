# delete data
../venv/bin/dynamodb-csv --truncate -t Footprint-z6dhum3edrgfpb2gc4mmjdexpu-prd
../venv/bin/dynamodb-csv --truncate -t Parameter-z6dhum3edrgfpb2gc4mmjdexpu-prd
../venv/bin/dynamodb-csv --truncate -t Option-z6dhum3edrgfpb2gc4mmjdexpu-prd
# upload data
../venv/bin/dynamodb-csv -i -t Footprint-z6dhum3edrgfpb2gc4mmjdexpu-prd -f ../footprint.csv
../venv/bin/dynamodb-csv -i -t Parameter-z6dhum3edrgfpb2gc4mmjdexpu-prd -f ../parameter.csv
../venv/bin/dynamodb-csv -i -t Option-z6dhum3edrgfpb2gc4mmjdexpu-prd -f ../option.csv
