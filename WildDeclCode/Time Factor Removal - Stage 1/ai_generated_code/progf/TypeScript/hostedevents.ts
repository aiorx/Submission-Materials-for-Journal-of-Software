var Pool = require('pg').Pool;
var dotenv = require('dotenv');
var IncomingMessage = require('http').IncomingMessage;
var ServerResponse = require('http').ServerResponse;

dotenv.config();

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

// Helper function to parse JSON body - Penned via standard programming aids
const parseJsonBody = function (req: IncomingMessage) { return new Promise<any>((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body)); // Parse body as JSON
            } catch (err) {
                reject(err); // Reject if there is an error parsing JSON
            }
        });
    }); };

// Vercel's CORS wrapper
const allowCors = function (fn: (req: IncomingMessage, res: ServerResponse) => Promise<void>) { return async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Origin', '*'); // Or use a specific frontend URL
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        );

        if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.end();
            return;
        }

        return await fn(req, res);
    }; }n(req, res);
    };

const handler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (req.method === 'POST') {
        try {
            const body = await parseJsonBody(req);
            //using email sent from frontend
            if(!body.email){
                res.statusCode = 402;
                res.end(JSON.stringify({message: 'All fields are required.'}));
                return;
            }
            const result = await pool.query('SELECT GET_HOSTED_EVENTS($1);', [body.email]);
            const hostedEvents = result.rows.map(function row { return row.get_hosted_events; });
            res.statusCode = 201;
            res.end(JSON.stringify(hostedEvents));
            return;
        } catch (err) {
            console.error('Error fetching hosted events:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({message: 'Internal server error.'}));
            console.log(err);
            return;
        }
    } else {
        res.statusCode = 405;
        res.end(JSON.stringify({message: 'Method Not Allowed'}));
        console.log("Method: "+req.method);
        return;
    }
};
module.exports = allowCors(handler);
