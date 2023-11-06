import { logger } from '../../services/logger.service.js'
import { authService } from '../auth/auth.service.js'
import { orderService } from './order.service.js'
import { socketService } from '../../services/socket.service.js'
export async function getOrders(req, res) {
  try {
    const orders = await orderService.query(req.query)

    res.send(orders)
  } catch (err) {
    logger.error('Cannot get orders', err)
    res.status(400).send({ err: 'Failed to get orders' })
  }
}

export async function deleteOrder(req, res) {
  try {
    const deletedCount = await orderService.remove(req.params.id)
    if (deletedCount === 1) {
      res.send({ msg: 'Deleted successfully' })
    } else {
      res.status(400).send({ err: 'Cannot remove order' })
    }
  } catch (err) {
    logger.error('Failed to delete order', err)
    res.status(400).send({ err: 'Failed to delete order' })
  }
}

export async function addOrder(req, res) {
  try {
    let order = req.body

    const newOrder = await orderService.add(order)

    // const loginToken = authService.getLoginToken(loggedinUser)
    logger.info('Added order', newOrder)
    res.send(newOrder)
  } catch (err) {
    logger.error('Failed to add order', err)
    res.status(400).send({ err: 'Failed to add order' })
  }
}
