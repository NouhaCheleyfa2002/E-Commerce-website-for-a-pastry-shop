import express from 'express';
import { subscribeNewsletter, getAllSubscribers, deleteSubscriber} from '../controllers/newsletterController.js';

const newsletterRouter = express.Router();

newsletterRouter.post('/subscribe', subscribeNewsletter);
newsletterRouter.get('/subscribers', getAllSubscribers);
newsletterRouter.delete('/:id', deleteSubscriber);

export default newsletterRouter;
