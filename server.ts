import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const distPath = path.resolve(import.meta.dirname, 'dist');

// Enable gzip compression header support & cache-control for max speed
app.use(express.static(distPath, {
  maxAge: '1d',
  etag: true,
}));

// Cloud Run Health Check
app.get('/_healthz', (req, res) => {
  res.status(200).send('OK');
});

// SPA fallback for all routes
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application build not found.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
