import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

const PAGE_SIZE = 3

// async function query(filterBy={txt:''}) {
//     try {
//         const criteria = {
//             vendor: { $regex: filterBy.txt, $options: 'i' }
//         }
//         const collection = await dbService.getCollection('car')
//         var carCursor = await collection.find(criteria)

//         if (filterBy.pageIdx !== undefined) {
//             carCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
//         }

//         const cars = carCursor.toArray()
//         return cars
//     } catch (err) {
//         logger.error('cannot find cars', err)
//         throw err
//     }
// }

const COLLECTION_KEY = 'stays'

async function getById(stayId) {
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
    stay.createdAt = Date.now()
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
    if (!stay._id) return `Cannot incert without ID, No Id found in object`

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
      _id: stay._id,
    }
    await collection.updateOne({ _id: ObjectId(stay._id) }, { $set: stayToSave })

    return stayToSave
  } catch (err) {
    logger.error(`cannot save stay ${stay._id}`, err)
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
  // query,
  getById,
  update,
  // addStayMsg,
  // removeStayMsg,
  add,
}
