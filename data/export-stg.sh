#!/bin/sh
aws dynamodb scan --table-name Profile-epwhhio5abgdthpzpwfkaox4ba-stg --profile jibungoto-planet > local/profile-stg.json
