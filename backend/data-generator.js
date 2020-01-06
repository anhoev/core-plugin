const dayjs = require('dayjs')
const _ = require('lodash')
const faker = require('faker')

module.exports = async (cms) => {
  cms.socket.on('connect', socket => {
    socket.on('generateData', handler)
  })

  const beginHour = (await cms.getModel('PosSetting').find({}))[0].generalSetting.beginHour || '00:00'

  const computeFns = {
    // Compute functions for Order collection
    getVTax(order) {
      return order.items.reduce((sum, item) => sum + getComputedTax(item) * item.quantity, 0)
    },
    getVSum(order) {
      return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    getReceivedPayment(order) {
      const sum = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return Math.ceil(getRandomInt(sum, sum + 50))
    },
    getCashback(order) {
      return order.receive - order.vSum
    },
    getPaymentValue(payment, order) {
      return order.receive
    },
    getVTaxGroups(order) {
      const taxGroups = _.groupBy(order.items, 'tax')
      return _.map(taxGroups, (val, key) => ({
        taxType: key,
        tax: Number.parseFloat(val.reduce((acc, item) => acc + getComputedTax(item) * item.quantity, 0)),
        sum: Number.parseFloat(val.reduce((acc, item) => acc + item.price * item.quantity, 0))
      }))
    },
    getVDate(order) {
      const [hour, minutes] = beginHour.split(':')
      const beginDateTime = dayjs(order.date).clone().hour(parseInt(hour)).minute(parseInt(minutes))

      if (dayjs(order.date).isBefore(beginDateTime)) {
        return beginDateTime.subtract(1, 'day').startOf('day').toDate()
      }

      return beginDateTime.startOf('day').toDate()
    },
    getUserDate(user, order) {
      return order.date
    },
    getBookingNumber(order) {
      return dayjs(order.date).format('YYMMDDHHmmssSSS')
    },
  }

  async function handler(model, callback) {
    let outputProp = null

    try {
      const result = await generateData(model.items, {})
      callback(result[outputProp])
    } catch (error) {
      callback(error)
    }

    async function generateData(items, scope) {
      for (const step of items) {
        switch (step.choice) {
          case 'genArrayWithEmptyObjects': {
            let {quantity, output} = step
            if (_.isObject(quantity)) {
              const {min, max} = quantity
              quantity = getRandomInt(min, max)
            }

            if (!outputProp) outputProp = output
            scope[output] = new Array(quantity).fill().map(Object)
            break
          }
          case 'fillWithFaker': {
            const {input, property, fakerApi} = step

            const generatedCategories = []
            for (const e of scope[input]) {
              const fakerFn = _.get(faker, fakerApi)
              let category = fakerFn()

              while (generatedCategories.includes(category)) category = fakerFn()

              generatedCategories.push(category)
              e[property] = category
            }
            break
          }
          case 'fillIncrementalNumbers': {
            let {input, property, from, saveAsString} = step

            for (const e of scope[input]) {
              if (saveAsString) e[property] = `${from++}`
              else e[property] = from++
            }
            break
          }
          case 'fillStringWithRatio': {
            const {input, property, data} = step
            let generatedData = []
            const generatedDataLength = Object.keys(scope[input]).length

            // generate data based on ratio
            data.forEach(e => {
              const {value, ratio} = e
              for (let i = 0; i < generatedDataLength * ratio / 100; i++) {
                generatedData.push(value)
              }
            })

            for (const e of scope[input]) {
              e[property] = popRandomElement(generatedData)
            }
            break
          }
          case 'fillArrayProperty': {
            const {input, property, innerScopeOutput} = step

            for (const e of scope[input]) {
              const innerScope = {outerScopeOutput: e}
              await generateData(step.items, innerScope, scope)
              e[property] = innerScope[innerScopeOutput]
            }
            break
          }
          case 'fillRefRandom': {
            const {input, collections, propertiesMapping, collectionsProperty} = step
            const Model = cms.getModel(collections)
            let dataList = await Model.find({})
            if (collectionsProperty) dataList = dataList[0][collectionsProperty]

            for (const e of scope[input]) {
              const data = popRandomElement(dataList)

              propertiesMapping.forEach(mapping => {
                const {source, target} = mapping
                e[target] = data[source]
              })
            }
            break
          }
          case 'fillRandomNumber': {
            const {input, property, range: {min, max}} = step

            for (const e of scope[input]) {
              e[property] = getRandomInt(min, max)
            }
            break
          }
          case 'fillComputedProperty': {
            const {input, property, computeFunction} = step
            const fn = computeFns[computeFunction]

            if (typeof fn === 'function') {
              for (const e of scope[input]) {
                e[property] = fn(e, scope.outerScopeOutput)
              }
            }
            break
          }
          case 'fillDatesForEachDay': {
            const {input, property, quantityForDay, from, to} = step
            let dates = generateDaysInRange(from, to, quantityForDay.min)
            // each day will now have {{quantityForDay.min}} dates, now distribute the remaining dates randomly and check for max
            const remainingDates = Object.keys(scope[outputProp]).length - dates.length

            if (remainingDates > 0) {
              const dates2 = generateDaysInRange(from, to, quantityForDay.max - quantityForDay.min)
              const remainingDifference = dates2.length - remainingDates
              for (let i = 0; i < remainingDifference; i++) {
                popRandomElement(dates2)
              }
              dates = dates.concat(dates2)
            }

            for (const e of scope[input]) {
              const randomDate = popRandomElement(dates)
              e[property] = randomDate ? dayjs(randomDate).toDate() : to
            }
            break
          }
        }
      }

      return scope
    }
  }

  function popRandomElement(array) {
    if (array.length === 0) return

    const randomIndex = getRandomInt(0, array.length - 1)
    return array.splice(randomIndex, 1)[0]
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function generateDaysInRange(from, to, numberOfDay) {
    const dates = []
    let currentDate = dayjs(from).startOf('day')
    let endDate = dayjs(to).startOf('day')

    while (!currentDate.isAfter(endDate)) {
      for (let i = 0; i < numberOfDay; i++) {
        const randomTime = currentDate.toDate().getTime() + getRandomInt(0, 86400 * 1000)
        dates.push(dayjs(randomTime).toDate().getTime())
      }

      currentDate = currentDate.add(1, 'day')
    }

    return dates
  }

  function getComputedTax(product) {
    return product.price * (1 - 1 / (1 + product.tax / 100))
  }
}
