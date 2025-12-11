import { Router } from 'express';
import { createShow } from '../controllers/adminController';
import { getShows, getShowDetails } from '../controllers/showController';
import { createBooking } from '../controllers/bookingController';

const router = Router();

// Admin Routes
router.post('/admin/shows', createShow);

// User Routes
router.get('/shows', getShows);
router.get('/shows/:id', getShowDetails);
router.post('/bookings', createBooking);

export default router;
