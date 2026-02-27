import express from 'express';
import cors from 'cors';
import downloadRoutes from './routes/download';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', downloadRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});