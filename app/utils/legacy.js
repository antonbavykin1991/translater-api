
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function recObject(objectToPush, value) {
  if (!value) {
    return
  }

  if (!value.length) {
    return
  }

  const neededObject = objectToPush.find(o => o.path === value[0])

  if (neededObject) {
    recObject(neededObject.populate, value.slice(1))
    return
  }

  objectToPush.push({
    path: value[0],
    populate: []
  })

  recObject(objectToPush[0].populate, value.slice(1))
}

const includeParser = (req) => {
  const include = req.query.include

  if (!include) {
    return null
  }

  const inc = typeof include === 'string' ? include.split(',') : include
  const res = []

  inc.forEach(i => {
    recObject(res, i.split('.'))
  })

  return res
}



function toJSONApi(model, included) {
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

            included[relSnapshot._id] = toJSONApi(relSnapshot, included)
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

          included[relSnapshot._id] = toJSONApi(relSnapshot, included)
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

const withInclude = async (model, req) => {
  const incData = includeParser(req) || []

  incData.forEach((inc) => {
    model.populate(inc)
  })

  const res = await model

  const includeObject = incData.reduce((combain, i) => { combain[i] = true; return combain}, {})
  const includedObject = {}

  const jsopApiResult = res.map(r => {
    return toJSONApi(r, includedObject)
  })

  return {
    data: jsopApiResult,
    included: Object.keys(includedObject).map(i => includedObject[i]),
  }
}
