import express from 'express';
import notificationRoutes from './routes/notificationRoutes';
import { json } from 'express';

const app = express();
app.use(json());
app.use(notificationRoutes);

app.get('/', (_req, res) => res.send('Notification service ready'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});
