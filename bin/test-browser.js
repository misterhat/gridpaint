#!/usr/bin/env node
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { spawn } from 'node:child_process';

const server = createServer(async (req, res) => {
    if (req.url === '/') {
        req.url = '/index.html';
    }

    const path = resolve(import.meta.dirname, '..', 'docs', req.url.slice(1));
    try {
        const contents = await readFile(path);
        let content_type = '';
        switch (extname(path)) {
        case '.js':
            content_type = 'application/javascript';
            break;
        case '.html':
            content_type = 'text/html';
            break;
        }
        res.writeHead(200, {
            'Content-Lenght': contents.length,
            'Content-Type': content_type,
        });
        res.write(contents);
        res.end();
    }
    catch {
        res.writeHead(404, {
            'Content-Lenght': 0,
        });
        res.end();
    }
});

server.listen(9582, 'localhost');
const handle = spawn('xdg-open', ['http://localhost:9582'], {
    detached: true,
});

handle.on('error', err => {
    console.error(err);
    console.error('do you not have xdg-open? open http://localhost:9582 manually.');
});

