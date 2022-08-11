# delete data
../venv/bin/dynamodb-csv --truncate -t Footprint-3uyvqum6jrc4pf63cde7njsxei-dev
../venv/bin/dynamodb-csv --truncate -t Parameter-3uyvqum6jrc4pf63cde7njsxei-dev
../venv/bin/dynamodb-csv --truncate -t Option-3uyvqum6jrc4pf63cde7njsxei-dev
# upload data
../venv/bin/dynamodb-csv -i -t Footprint-3uyvqum6jrc4pf63cde7njsxei-dev -f ../footprint.csv
../venv/bin/dynamodb-csv -i -t Parameter-3uyvqum6jrc4pf63cde7njsxei-dev -f ../parameter.csv
../venv/bin/dynamodb-csv -i -t Option-3uyvqum6jrc4pf63cde7njsxei-dev -f ../option.csv
