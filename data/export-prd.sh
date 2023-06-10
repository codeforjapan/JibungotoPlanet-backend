#!/bin/sh
aws dynamodb scan --table-name prdJibungotoPlanetprofile --profile jibungoto-planet > local/profile-prd.json
