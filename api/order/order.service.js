import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb
const COLLECTION_KEY = 'orders'

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection(COLLECTION_KEY)

    if (filterBy.buyerId) {
      criteria['buyer._id'] = new ObjectId(filterBy.buyerId)
    }

    const orders = await collection.find(criteria).toArray()
    return orders
  } catch (err) {
    throw new Error(`Failed to retrieve orders: ${err.message}`)
  }
}
//   let orders = await collection
//     .aggregate([
//       {
//         $match: criteria,
//       },
//       {
//         $lookup: {
//           localField: 'byUserId',
//           from: 'user',
//           foreignField: '_id',
//           as: 'byUser',
//         },
//       },
//       {
//         $unwind: '$byUser',
//       },
//       {
//         $lookup: {
//           localField: 'aboutToyId',
//           from: 'stay',
//           foreignField: '_id',
//           as: 'aboutToy',
//         },
//       },
//       {
//         $unwind: '$aboutToy',
//       },
//     ])
//     .toArray()

//   orders = orders.map((order) => {
//     order.byUser = { _id: order.byUser._id, fullname: order.byUser.fullname }
//     order.aboutToy = { _id: order.aboutToy._id, name: order.aboutToy.name }
//     delete order.userId
//     delete order.aboutToyId
//     return order
//   })

//   return orders
// } catch (err) {
//   logger.error('cannot find reviews', err)
//   throw err
// }
async function remove(orderId) {
  try {
    // const store = asyncLocalStorage.getStore()
    // const { loggedinUser } = store
    const collection = await dbService.getCollection(COLLECTION_KEY)
    // remove only if user is owner/admin
    const criteria = { _id: ObjectId(orderId) }
    // if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
    const { deletedCount } = await collection.deleteOne(criteria)
    return deletedCount
  } catch (err) {
    logger.error(`cannot remove order ${orderId}`, err)
    throw err
  }
}

async function add(order) {
  try {
    const collection = await dbService.getCollection(COLLECTION_KEY)
    const { checkIn, checkOut, guests, stay, buyer, hostId, hostName, status, totalPrice, nights } =
      order

    const orderToAdd = {
      checkIn,
      checkOut,
      guests,
      status,
      stay: {
        _id: ObjectId(stay._id),
        name: stay.name,
        price: stay.price,
      },
      buyer: {
        _id: ObjectId(buyer._id),
        fullname: buyer.fullname,
      },
      hostId: ObjectId(hostId),
      hostName,
      totalPrice,
      nights,
    }
    const result = await collection.insertOne(orderToAdd)
    order._id = result.insertedId
  } catch (err) {
    logger.error('cannot insert order', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.buyerId) {
    criteria['buyer._id'] = new ObjectId(filterBy.buyerId)
  }
  if (filterBy.stayId) criteria.stayId = ObjectId(filterBy.stayId)
  return criteria
}

export const orderService = {
  query,
  remove,
  add,
}
