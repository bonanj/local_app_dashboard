import express from "express";
import { createServer as createViteServer } from "vite";
import net from "net";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API to scan ports
  app.get("/api/scan", async (req, res) => {
    const startPort = 3000;
    const endPort = 3020;
    const results = [];

    const checkPort = (port: number): Promise<{ port: number; open: boolean; title?: string }> => {
      return new Promise((resolve) => {
        const socket = new net.Socket();
        const timeout = 400; // Fast timeout for local scan

        socket.setTimeout(timeout);
        socket.on("connect", async () => {
          socket.destroy();
          
          let title = "";
          try {
            // Attempt to fetch the title if the port is open
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 800);
            
            const response = await fetch(`http://127.0.0.1:${port}`, { signal: controller.signal });
            clearTimeout(id);
            
            if (response.ok) {
              const text = await response.text();
              const match = text.match(/<title>(.*?)<\/title>/i);
              if (match && match[1]) {
                title = match[1].trim();
              }
            }
          } catch (e) {
            // Ignore fetch errors (e.g., not an HTTP service)
          }
          
          resolve({ port, open: true, title: title || undefined });
        });
        socket.on("timeout", () => {
          socket.destroy();
          resolve({ port, open: false });
        });
        socket.on("error", () => {
          socket.destroy();
          resolve({ port, open: false });
        });

        socket.connect(port, "127.0.0.1");
      });
    };

    const scanPromises = [];
    for (let p = startPort; p <= endPort; p++) {
      scanPromises.push(checkPort(p));
    }

    const scanResults = await Promise.all(scanPromises);
    res.json(scanResults);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
