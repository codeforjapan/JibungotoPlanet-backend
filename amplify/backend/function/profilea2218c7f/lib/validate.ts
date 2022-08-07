import Ajv from 'ajv'

const ajv = new Ajv()

const schema = {
  type: 'object',
  properties: {
    gender: { type: 'string', pattern: 'male|female|unknown' },
    age: { type: 'string', pattern: '10s|20s|30s|40s|50s|60s|70s-' },
    region: {
      type: 'string',
      pattern: 'hokkaido|tohoku|kanto|tokai|kinki|chugoku|sikoku|kyusyu|okinawa'
    },

    housingAnswerSchema: {
      type: 'object',
      properties: {
        residentCount: { type: 'number' },
        electricityMonthlyConsumption: { type: 'number' },
        useGas: { type: 'boolean' },
        gasMonthlyConsumption: { type: 'number' },
        useKerosene: { type: 'boolean' },
        keroseneMonthlyConsumption: { type: 'number' },
        keroseneMonthCount: { type: 'number' },

        housingSizeKey: {
          type: 'string',
          pattern: '1-room|2-room|3-room|4-room|5-6-room|7-more-room|unknown'
        },
        housingInsulationFirstKey: {
          type: 'string',
          pattern: 'no-insulation|2-level|3-level|4-level|unknown'
        },
        electricityIntensityKey: {
          type: 'string',
          pattern:
            'conventional|30-renewable|50-renewable|100-renewable|solar-panel|unknown'
        },
        electricitySeasonFactorKey: {
          type: 'string',
          pattern:
            'january|february|march|april|may|june|july|august|september|october|november|december'
        },
        energyHeatIntensityKey: {
          type: 'string',
          pattern: 'urban-gas|lpg|unknown'
        },
        gasSeasonFactorKey: {
          type: 'string',
          pattern:
            'january|february|march|april|may|june|july|august|september|october|november|december'
        },
        housingAmountByRegionFirstKey: {
          type: 'string',
          pattern: 'northeast|middle|southwest|unknown'
        }
      }
    },

    mobilityAnswerSchema: {
      type: 'object',
      properties: {
        carIntensityFactorFirstKey: {
          type: 'string',
          pattern: 'gasoline|light|hv|phv|ev|unknown'
        },
        carChargingKey: {
          type: 'string',
          pattern:
            'charge-almost-at-home|use-charging-spots-occasionally|use-charging-spots-sometimes|use-charging-spots-usually|unknown'
        },
        carPassengersFirstKey: {
          type: 'string',
          pattern: '1|1-2|2|2-3|3|3-4|4-more|unknown'
        },
        mileageByAreaFirstKey: {
          type: 'string',
          pattern:
            'major-city-or-metropolitan-area|city-150k-more|city-50k-150k|area-less-than-50k|unknown'
        },

        hasPrivateCar: { type: 'boolean' },
        privateCarAnnualMileage: { type: 'number' },
        trainWeeklyTravelingTime: { type: 'number' },
        busWeeklyTravelingTime: { type: 'number' },
        motorbikeWeeklyTravelingTime: { type: 'number' },
        otherCarWeeklyTravelingTime: { type: 'number' },
        hasTravelingTime: { type: 'boolean' },
        otherCarAnnualTravelingTime: { type: 'number' },
        trainAnnualTravelingTime: { type: 'number' },
        busAnnualTravelingTime: { type: 'number' },
        motorbikeAnnualTravelingTime: { type: 'number' },
        airplaneAnnualTravelingTime: { type: 'number' },
        ferryAnnualTravelingTime: { type: 'number' }
      }
    },

    foodAnswerSchema: {
      type: 'object',
      properties: {
        foodIntakeFactorKey: {
          type: 'string',
          pattern:
            'very-little|somewhat-little|moderate|somewhat-much|very-much|unknown'
        },
        foodDirectWasteFactorKey: {
          type: 'string',
          pattern:
            'seldom|1-per-week|2-3-per-week|4-7-per-week|8-more-per-week|unknown'
        },
        foodLeftoverFactorKey: {
          type: 'string',
          pattern:
            'seldom|1-per-week|2-3-per-week|4-7-per-week|8-more-per-week|unknown'
        },
        dishBeefFactorKey: {
          type: 'string',
          pattern:
            'everyday|4-5-per-week|2-3-per-week|1-per-week|2-3-per-month|1-less-per-month|never|unknown'
        },
        dishPorkFactorKey: {
          type: 'string',
          pattern:
            'everyday|4-5-per-week|2-3-per-week|1-per-week|2-3-per-month|1-less-per-month|never|unknown'
        },
        dishChickenFactorKey: {
          type: 'string',
          pattern:
            'everyday|4-5-per-week|2-3-per-week|1-per-week|2-3-per-month|1-less-per-month|never|unknown'
        },

        dishSeafoodFactorKey: {
          type: 'string',
          pattern:
            'everyday|4-5-per-week|2-3-per-week|1-per-week|2-3-per-month|1-less-per-month|never|unknown'
        },
        dairyFoodFactorKey: {
          type: 'string',
          pattern:
            '3-more-per-day|2-per-day|1-per-day|half-of-week|1-2-less-per-week|never|unknown'
        },
        alcoholFactorKey: {
          type: 'string',
          pattern:
            'everyday|4-5-per-week|2-3-per-week|1-per-week|2-3-less-per-month|never|unknown'
        },
        softDrinkSnackFactorKey: {
          type: 'string',
          pattern: '3k-less|3k-5k|5k-10k|10k-15k|15k-more|unknown'
        },
        eatOutFactorKey: {
          type: 'string',
          pattern: '5k-less|5k-10k|10k-20k|20k-50k|50k-more|unknown'
        }
      }
    },

    otherAnswerSchema: {
      type: 'object',
      properties: {
        dailyGoodsAmountKey: {
          type: 'string',
          pattern:
            '5k-less|5k-10k|10k-20k|20k-30k|30k-more|unknown|average-per-capita'
        },
        communicationAmountKey: {
          type: 'string',
          pattern:
            '5k-less|5k-10k|10k-20k|20k-30k|30k-more|unknown|average-per-capita'
        },
        applianceFurnitureAmountKey: {
          type: 'string',
          pattern:
            '50k-less|50k-100k|100k-200k|200k-300k||300k-400k|400k-more|unknown|average-per-capita'
        },
        serviceFactorKey: {
          type: 'string',
          pattern: '5k-less|5k-10k|10k-20k|20k-50k|50k-more|unknown'
        },
        hobbyGoodsFactorKey: {
          type: 'string',
          pattern: '5k-less|5k-10k|10k-20k|20k-50k|50k-more|unknown'
        },
        clothesBeautyFactorKey: {
          type: 'string',
          pattern: '5k-less|5k-10k|10k-20k|20k-50k|50k-more|unknown'
        },
        leisureSportsFactorKey: {
          type: 'string',
          pattern: '5k-less|5k-10k|10k-20k|20k-50k|50k-more|unknown'
        },
        travelFactorKey: {
          type: 'string',
          pattern:
            '10k-less|10k-30k|30k-50k|50k-100k|100k-200k|200k-more|unknown'
        }
      }
    }
  },
  additionalProperties: true
}

const validateSchema = ajv.compile(schema)

const validate = (body) => {
  /*
  const validHousingAnswer = housingAnswer
    ? validateHousingAnswer(housingAnswer)
    : true
  const validMobilityAnswer = mobilityAnswer
    ? validateMobilityAnswer(mobilityAnswer)
    : true
  const validFoodAnswer = foodAnswer ? validateFoodAnswer(foodAnswer) : true
  const validOtherAnswer = otherAnswer ? validateOtherAnswer(otherAnswer) : true
  */

  /*
  if (!validHousingAnswer) {
    console.log(housingAnswer)
    console.log(validateHousingAnswer.errors)
  }
  if (!validMobilityAnswer) {
    console.log(mobilityAnswer)
    console.log(validateMobilityAnswer.errors)
  }
  if (!validFoodAnswer) {
    console.log(foodAnswer)
    console.log(validateFoodAnswer.errors)
  }
  if (!validOtherAnswer) {
    console.log(otherAnswer)
    console.log(validateOtherAnswer.errors)
  }
  */

  return validateSchema(body)
  /*
    validHousingAnswer &&
    validMobilityAnswer &&
    validFoodAnswer &&
    validOtherAnswer
  )
  */
}

export { validate }
