const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function includeToPopulate(objectToPush, value) {
  if (!value) {
    return
  }

  if (!value.length) {
    return
  }

  const neededObject = objectToPush.find(o => o.path === value[0])

  if (neededObject) {
    includeToPopulate(neededObject.populate, value.slice(1))
    return
  }

  objectToPush.push({
    path: value[0],
    populate: []
  })

  includeToPopulate(objectToPush[0].populate, value.slice(1))
}

function queryParamsParser(req) {
  const include = req.query.include

  if (!include) {
    return []
  }

  const inc = typeof include === 'string' ? include.split(',') : include

  return inc.reduce((container, i) => {
    includeToPopulate(container, i.split('.'))
    return container
  }, [])
}

function serializeModelToJSONApi(model, included) {
  const paths = model.schema.paths
  const snapshot = model.toJSON()
  const relationships = {}
  const attributes = {}

  Object.keys(paths).forEach((path) => {
    if (path === '__v') {
      delete snapshot[path]
      return
    }

    if (path === 'type') {
      return
    }

    if (path === '_id') {
      snapshot.id = model._id
      delete snapshot._id
      return
    }

    if (paths[path] instanceof Schema.Types.Array) {
      if (!model[path].length) {
        relationships[path] = {
          data: []
        }
      } else {
        relationships[path] = {
          data: []
        }

        model[path].forEach(relSnapshot => {
          const s = relSnapshot.toJSON()

          if (typeof s === 'object') {
            relationships[path].data.push({
              id: relSnapshot._id,
              type: relSnapshot.type
            })

            included[relSnapshot._id] = serializeModelToJSONApi(relSnapshot, included)
          }
        })
      }

      delete snapshot[path]
      return
    }

    if (paths[path] instanceof Schema.Types.ObjectId) {
      relationships[path] = {
        data: {}
      }

      const relSnapshot = model[path]

      if (relSnapshot) {
        const s = relSnapshot.toJSON()

        if (typeof s === 'object') {
          relationships[path] = {
            data: {
              id: relSnapshot._id,
              type: relSnapshot.type,
            }
          }

          included[relSnapshot._id] = serializeModelToJSONApi(relSnapshot, included)
        }
      }

      delete snapshot[path]
      return
    }

    attributes[path] = model[path]
    delete snapshot[path]
  })

  snapshot.attributes = attributes
  snapshot.relationships = relationships

  return snapshot
}

async function toJSONApi(model, req) {
  const included = {}
  const populateData = queryParamsParser(req)

  populateData.forEach((populate) => {
    model.populate(populate)
  })

  const result = await model

  const jsopApiResult = result.map(r => {
    return serializeModelToJSONApi(r, included)
  })

  return {
    data: jsopApiResult,
    included: Object.keys(included).map(i => included[i])
  }
}

module.exports = {
  includeToPopulate,
  queryParamsParser,
  serializeModelToJSONApi,
  toJSONApi
}
