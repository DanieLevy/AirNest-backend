import express from 'express'
import {
  addStay,
  // addStayMsg,
  getStayById,
  // getStays,
  removeStay,
  // removeStayMsg,
  updateStay,
} from './stay.controller.js'
import { requireAdmin, requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

export const stayRoutes = express.Router()

// stayRoutes.get('/', log, getStays)
stayRoutes.get('/:stayId', getStayById)
stayRoutes.post('/', addStay)
stayRoutes.put('/:stayId', updateStay)
stayRoutes.delete('/:stayId', removeStay)

// stayRoutes.post('/:id/msg', requireAuth, addStayMsg)
// stayRoutes.delete('/:id/msg/:msgId', requireAuth, removeStayMsg)
