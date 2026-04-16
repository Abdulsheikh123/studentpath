import express from 'express'
import { getStates, getDistricts, getPopularCities } from '../controllers/locationController.js'

const router = express.Router()

router.get('/states', getStates)
router.get('/districts', getDistricts)
router.get('/popular-cities', getPopularCities)

export default router
