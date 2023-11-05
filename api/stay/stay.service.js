import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb
const COLLECTION_KEY = 'stays'
const PAGE_SIZE = 3

async function query(filterBy = {}) {
  try {
    // Define the base criteria with an empty query that matches everything
    let criteria = {}

    // Calculate the capacity if adults or children are specified
    if (filterBy.adults || filterBy.children) {
      const capacity = (parseInt(filterBy.adults, 10) || 0) + (parseInt(filterBy.children, 10) || 0)
      criteria.capacity = { $gte: capacity } // $gte means 'greater than or equal'
    }

    // Filter by region if specified
    if (filterBy.region && filterBy.region !== '') {
      // Assuming region is in the format "City,Country" and you want to match against country
      const regionParts = filterBy.region.split(',')
      const countryRegex = new RegExp(regionParts[regionParts.length - 1], 'i')
      criteria['loc.country'] = { $regex: countryRegex }
    }

    // Filter by label if specified
    if (filterBy.label) {
      criteria.labels = { $in: [filterBy.label] } // $in selects the documents where the value of a field equals any value in the specified array
    }

    const collection = await dbService.getCollection(COLLECTION_KEY) // make sure to use the correct collection name
    var stayCursor = await collection.find(criteria)

    // Implement pagination if needed
    // if (filterBy.pageIdx !== undefined) {
    //   stayCursor = stayCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE);
    // }

    const stays = await stayCursor.toArray()
    return stays
  } catch (err) {
    logger.error('cannot find stays', err)
    throw err
  }
}

async function getById(stayId) {
  console.log('🚀 ~ file: stay.service.js:50 ~ getById ~ stayId:', stayId)
  try {
    const collection = await dbService.getCollection(COLLECTION_KEY)
    const stay = await collection.findOne({ _id: ObjectId(stayId) })
    return stay
  } catch (err) {
    logger.error(`while finding stay ${stayId}`, err)
    throw err
  }
}

async function remove(stayId) {
  try {
    const collection = await dbService.getCollection(COLLECTION_KEY)
    await collection.deleteOne({ _id: ObjectId(stayId) })
    return stayId
  } catch (err) {
    logger.error(`cannot remove stay ${stayId}`, err)
    throw err
  }
}

async function add(stay) {
  try {
    const collection = await dbService.getCollection(COLLECTION_KEY)

    const newStay = {
      name: stay.name,
      type: stay.type,
      imgUrls: stay.imgUrls,
      price: stay.price,
      summary: stay.summary,
      capacity: stay.capacity,
      amenities: stay.amenities,
      bathrooms: stay.bathrooms,
      bedrooms: stay.bedrooms,
      roomType: stay.roomType,
      host: stay.host,
      loc: stay.loc,
      reviews: stay.reviews,
      likedByUsers: stay.likedByUsers,
      beds: stay.beds,
      propertyType: stay.propertyType,
      labels: stay.labels,
    }
    newStay.createdAt = Date.now()
    const result = await collection.insertOne(newStay)
    stay._id = result.insertedId
  } catch (err) {
    logger.error(`cannot add stay ${stay._id}`, err)
    throw err
  }
}

async function update(stay) {
  try {
    const collection = await dbService.getCollection(COLLECTION_KEY)
    if (!stay._id) return `Cannot update without ID, No Id found in object`

    const stayToSave = {
      name: stay.name,
      type: stay.type,
      imgUrls: stay.imgUrls,
      price: stay.price,
      summary: stay.summary,
      capacity: stay.capacity,
      amenities: stay.amenities,
      bathrooms: stay.bathrooms,
      bedrooms: stay.bedrooms,
      roomType: stay.roomType,
      host: stay.host,
      loc: stay.loc,
      reviews: stay.reviews,
      likedByUsers: stay.likedByUsers,
      beds: stay.beds,
      propertyType: stay.propertyType,
      labels: stay.labels,
      createdAt: stay.createdAt,
    }

    await collection.updateOne({ _id: ObjectId(stay._id) }, { $set: stayToSave })

    return { ...stayToSave, _id: stay._id }
  } catch (err) {
    logger.error(`cannot update stay ${stay._id}`, err)
    throw err
  }
}

// async function addStayMsg(stayId, msg) {
//   try {
//     msg.id = utilService.makeId()
//     const collection = await dbService.getCollection(COLLECTION_KEY)
//     await collection.updateOne({ _id: ObjectId(stayId) }, { $push: { msgs: msg } })
//     return msg
//   } catch (err) {
//     logger.error(`cannot add stay msg ${stayId}`, err)
//     throw err
//   }
// }

// async function removeStayMsg(stayId, msgId) {
//   try {
//     const collection = await dbService.getCollection(COLLECTION_KEY)
//     await collection.updateOne({ _id: ObjectId(stayId) }, { $pull: { msgs: { id: msgId } } })
//     return msgId
//   } catch (err) {
//     logger.error(`cannot add stay msg ${stayId}`, err)
//     throw err
//   }
// }

export const stayService = {
  remove,
  query,
  getById,
  update,
  // addStayMsg,
  // removeStayMsg,
  add,
}
