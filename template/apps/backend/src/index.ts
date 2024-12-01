import express from 'express';

const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;