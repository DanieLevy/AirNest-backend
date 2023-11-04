import { logger } from '../../services/logger.service.js'
import { stayService } from './stay.service.js'

// export async function getStays(req, res) {
//   try {
//     const { name, price, labels, createdAt, inStock, type, desc } = req.query
//     const filterBy = { name, price: +price, inStock, labels, createdAt }
//     const sortBy = { type, desc }

//     const stays = await stayService.query(filterBy, sortBy)
//     res.json(stays)
//   } catch (err) {
//     logger.error('Cannot load stays', err)
//     res.status(400).send('Cannot load stays')
//   }
// }

//add
export async function addStay(req, res) {
  try {
    const stay = {
      name: req.body.name,
      type: req.body.type,
      imgUrls: req.body.imgUrls,
      price: req.body.price,
      summary: req.body.summary,
      capacity: req.body.capacity,
      amenities: req.body.amenities,
      bathrooms: req.body.bathrooms,
      bedrooms: req.body.bedrooms,
      roomType: req.body.roomType,
      host: req.body.host,
      loc: req.body.loc,
      reviews: req.body.reviews,
      likedByUsers: req.body.likedByUsers,
      beds: req.body.beds,
      propertyType: req.body.propertyType,
      labels: req.body.labels,
    }

    const addedStay = await stayService.add(stay)
    res.json(addedStay)
  } catch (err) {
    logger.error(`Cannot add stay`, err)
    res.status(400).send(`Cannot add stay`)
  }
}
//edit
export async function updateStay(req, res) {
  try {
    const stay = req.body

    const updatedStay = await stayService.update(stay)
    res.json(updatedStay)
  } catch (err) {
    logger.error(`Cannot update stay`, err)
    res.status(400).send(`Cannot update stay`)
  }
}

// Read - getById
export async function getStayById(req, res) {
  try {
    const { stayId } = req.params

    const stay = await stayService.getById(stayId)
    res.json(stay)
  } catch (err) {
    logger.error('Cannot get stay', err)
    res.status(400).send('Cannot get stay')
  }
}
// //remove
export async function removeStay(req, res) {
  try {
    const stayId = req.params.id
    const removedId = await stayService.remove(stayId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove stay', err)
    res.status(400).send({ err: 'Failed to remove stay' })
  }
}

// export async function addStayMsg(req, res) {
//   const { loggedinUser } = req
//   try {
//     const stayId = req.params.id
//     const msg = {
//       txt: req.body.txt,
//       by: loggedinUser,
//     }
//     const savedMsg = await stayService.addStayMsg(stayId, msg)
//     res.json(savedMsg)
//   } catch (err) {
//     logger.error('Failed to update stay', err)
//     res.status(400).send({ err: 'Failed to update stay' })
//   }
// }

// export async function removeStayMsg(req, res) {
//   // const {loggedinUser} = req
//   try {
//     const stayId = req.params.id
//     const { msgId } = req.params

//     const removedId = await stayService.removeStayMsg(stayId, msgId)
//     res.send(removedId)
//   } catch (err) {
//     logger.error('Failed to remove stay msg', err)
//     res.status(400).send({ err: 'Failed to remove stay msg' })
//   }
// }
