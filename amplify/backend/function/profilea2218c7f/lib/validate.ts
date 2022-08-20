import Ajv from 'ajv'

const ajv = new Ajv()

const schema = {
  type: 'object',
  properties: {
    gender: { type: 'string', pattern: '^male$|^female$|^unknown' },
    age: {
      type: 'string',
      pattern: '^10s$|^20s$|^30s$|^40s$|^50s$|^60s$|^70s-$'
    },
    region: {
      type: 'string',
      pattern:
        '^hokkaido$|^tohoku$|^kanto$|^tokai$|^kinki$|^chugoku$|^sikoku$|^kyusyu$|^okinawa$'
    },

    housingAnswer: {
      type: 'object',
      properties: {
        residentCount: { type: 'number', minimum: 1 },
        electricityMonthlyConsumption: { type: 'number', minimum: 0 },
        useGas: { type: 'boolean' },
        gasMonthlyConsumption: { type: 'number', minimum: 0 },
        useKerosene: { type: 'boolean' },
        keroseneMonthlyConsumption: { type: 'number', minimum: 0 },
        keroseneMonthCount: { type: 'number', minimum: 0 },

        housingSizeKey: {
          type: 'string',
          pattern:
            '^1-room$|^2-room$|^3-room$|^4-room$|^5-6-room$|^7-more-room$|^unknown$'
        },
        housingInsulationFirstKey: {
          type: 'string',
          pattern: '^no-insulation$|^2-level$|^3-level$|^4-level$|^unknown$'
        },
        electricityIntensityKey: {
          type: 'string',
          pattern:
            '^conventional$|^30-renewable$|^50-renewable$|^100-renewable$|^solar-panel$|^unknown$'
        },
        electricitySeasonFactorKey: {
          type: 'string',
          pattern:
            '^january$|^february$|^march$|^april$|^may$|^june$|^july$|^august$|^september$|^october$|^november$|^december$'
        },
        energyHeatIntensityKey: {
          type: 'string',
          pattern: '^urban-gas$|^lpg$|^unknown$'
        },
        gasSeasonFactorKey: {
          type: 'string',
          pattern:
            '^january$|^february$|^march$|^april$|^may$|^june$|^july$|^august$|^september$|^october$|^november$|^december$'
        },
        housingAmountByRegionFirstKey: {
          type: 'string',
          pattern: '^northeast$|^middle$|^southwest$|^unknown$'
        }
      }
    },

    mobilityAnswer: {
      type: 'object',
      properties: {
        carIntensityFactorFirstKey: {
          type: 'string',
          pattern: '^gasoline$|^light$|^hv$|^phv$|^ev$|^unknown$'
        },
        carChargingKey: {
          type: 'string',
          pattern:
            '^charge-almost-at-home$|^use-charging-spots-occasionally$|^use-charging-spots-sometimes$|^use-charging-spots-usually$|^unknown$'
        },
        carPassengersFirstKey: {
          type: 'string',
          pattern: '^1$|^1-2$|^2$|^2-3$|^3$|^3-4$|^4-more$|^unknown$'
        },
        mileageByAreaFirstKey: {
          type: 'string',
          pattern:
            '^major-city-or-metropolitan-area$|^city-150k-more$|^city-50k-150k$|^area-less-than-50k$|^unknown$'
        },

        hasPrivateCar: { type: 'boolean' },
        privateCarAnnualMileage: { type: 'number', minimum: 0 },
        trainWeeklyTravelingTime: { type: 'number', minimum: 0 },
        busWeeklyTravelingTime: { type: 'number', minimum: 0 },
        motorbikeWeeklyTravelingTime: { type: 'number', minimum: 0 },
        otherCarWeeklyTravelingTime: { type: 'number', minimum: 0 },
        hasTravelingTime: { type: 'boolean' },
        otherCarAnnualTravelingTime: { type: 'number', minimum: 0 },
        trainAnnualTravelingTime: { type: 'number', minimum: 0 },
        busAnnualTravelingTime: { type: 'number', minimum: 0 },
        motorbikeAnnualTravelingTime: { type: 'number', minimum: 0 },
        airplaneAnnualTravelingTime: { type: 'number', minimum: 0 },
        ferryAnnualTravelingTime: { type: 'number', minimum: 0 }
      }
    },

    foodAnswer: {
      type: 'object',
      properties: {
        foodIntakeFactorKey: {
          type: 'string',
          pattern:
            '^very-little$|^somewhat-little$|^moderate$|^somewhat-much$|^very-much$|^unknown$'
        },
        foodDirectWasteFactorKey: {
          type: 'string',
          pattern:
            '^seldom$|^1-per-week$|^2-3-per-week$|^4-7-per-week$|^8-more-per-week$|^unknown$'
        },
        foodLeftoverFactorKey: {
          type: 'string',
          pattern:
            '^seldom$|^1-per-week$|^2-3-per-week$|^4-7-per-week$|^8-more-per-week$|^unknown$'
        },
        dishBeefFactorKey: {
          type: 'string',
          pattern:
            '^everyday$|^4-5-per-week$|^2-3-per-week$|^1-per-week$|^2-3-per-month$|^1-less-per-month$|^never$|^unknown$'
        },
        dishPorkFactorKey: {
          type: 'string',
          pattern:
            '^everyday$|^4-5-per-week$|^2-3-per-week$|^1-per-week$|^2-3-per-month$|^1-less-per-month$|^never$|^unknown$'
        },
        dishChickenFactorKey: {
          type: 'string',
          pattern:
            '^everyday$|^4-5-per-week$|^2-3-per-week$|^1-per-week$|^2-3-per-month$|^1-less-per-month$|^never$|^unknown'
        },

        dishSeafoodFactorKey: {
          type: 'string',
          pattern:
            '^everyday$|^4-5-per-week$|^2-3-per-week$|^1-per-week$|^2-3-per-month$|^1-less-per-month$|^never$|^unknown$'
        },
        dairyFoodFactorKey: {
          type: 'string',
          pattern:
            '^3-more-per-day$|^2-per-day$|^1-per-day$|^half-of-week$|^1-2-less-per-week$|^never$|^unknown$'
        },
        alcoholFactorKey: {
          type: 'string',
          pattern:
            '^everyday$|^4-5-per-week$|^2-3-per-week$|^1-per-week$|^2-3-less-per-month$|^never$|^unknown$'
        },
        softDrinkSnackFactorKey: {
          type: 'string',
          pattern: '^3k-less$|^3k-5k$|^5k-10k$|^10k-15k$|^15k-more$|^unknown$'
        },
        eatOutFactorKey: {
          type: 'string',
          pattern: '^5k-less$|^5k-10k$|^10k-20k$|^20k-50k$|^50k-more$|^unknown$'
        }
      }
    },

    otherAnswer: {
      type: 'object',
      properties: {
        dailyGoodsAmountKey: {
          type: 'string',
          pattern:
            '^5k-less$|^5k-10k$|^10k-20k$|^20k-30k$|^30k-more$|^unknown$|^average-per-capita$'
        },
        communicationAmountKey: {
          type: 'string',
          pattern:
            '^5k-less$|^5k-10k$|^10k-20k$|^20k-30k$|^30k-more$|^unknown$|^average-per-capita$'
        },
        applianceFurnitureAmountKey: {
          type: 'string',
          pattern:
            '^50k-less$|^50k-100k$|^100k-200k$|^200k-300k$|^$|^300k-400k$|^400k-more$|^unknown$|^average-per-capita$'
        },
        serviceFactorKey: {
          type: 'string',
          pattern: '^5k-less$|^5k-10k$|^10k-20k$|^20k-50k$|^50k-more$|^unknown$'
        },
        hobbyGoodsFactorKey: {
          type: 'string',
          pattern: '^5k-less$|^5k-10k$|^10k-20k$|^20k-50k$|^50k-more$|^unknown$'
        },
        clothesBeautyFactorKey: {
          type: 'string',
          pattern: '^5k-less$|^5k-10k$|^10k-20k$|^20k-50k$|^50k-more$|^unknown$'
        },
        leisureSportsFactorKey: {
          type: 'string',
          pattern: '^5k-less$|^5k-10k$|^10k-20k$|^20k-50k$|^50k-more$|^unknown$'
        },
        travelFactorKey: {
          type: 'string',
          pattern:
            '^10k-less$|^10k-30k$|^30k-50k$|^50k-100k$|^100k-200k$|^200k-more$|^unknown$'
        }
      }
    }
  },
  additionalProperties: true
}

const validate = ajv.compile(schema)

export { validate }
