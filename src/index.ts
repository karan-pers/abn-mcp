import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config();
const app = express();
app.use(express.json());

app.post('/mcp', async (req: Request, res: Response) => {
    try {
        const cookie = req.headers['cookie'];
        if (!cookie) {
            console.log("Cookie is required");
        }
        const staticHeaders = {
            'accept': 'application/json',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,nl;q=0.7',
            'priority': 'u=1, i',
            'content-type': 'application/json',
            'authorization': 'Basic bjJnN2ROVzY6MzNubUFMM3U=',
            'consumer-id': 'AAB.SYS.024193',
            'referer': 'https://www-et1.abnamro.nl/mijn-abnamro/betalen/bij-en-afschrijvingen/',
            'request-id': '|38e9e41efd8e46b4b3963df7d2ae1f77.07eab036015b4c8b',
            'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'traceparent': '00-38e9e41efd8e46b4b3963df7d2ae1f77-07eab036015b4c8b-01',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
            'x-aab-serviceversion': 'v3',
            'origin': 'https://www-et1.abnamro.nl',
            'Cookie': cookie,
        }

        const chasmSpecificHeaders = {
            'accept': 'application/json',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'authorization': 'Basic bjJnN2ROVzY6MzNubUFMM3U=',
            'pii-customer-id': '3936759',
            'priority': 'u=1, i',
            'referer': 'https://www-et1.abnamro.nl/my-abnamro/self-service/general/index.html',
            'request-context': 'appId=cid-v1:70813994-87b0-47ee-8856-6b6b163d1930',
            'request-id': '|7ee349c88b8d4a6dadd2c3bce62276a0.bc0f0b693bd84050',
            'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'source': 'OAM',
            'trace-id': 'OAM1751459105472',
            'traceparent': '00-7ee349c88b8d4a6dadd2c3bce62276a0-bc0f0b693bd84050-01',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            'x-xsrf-header': 'test, token',
            'cookie': cookie
        }

        // Create a new MCP server instance for each request
        const server = new McpServer({
            name: "Demo",
            version: "1.0.0"
        });

        server.tool(
            "calculate-bmi",
            {
                weightKg: z.number().describe("Weight in kilograms"),
                heightM: z.number().describe("Height in meters")
            },
            async ({ weightKg, heightM }) => ({
                content: [{
                    type: "text",
                    text: String(weightKg / (heightM * heightM))
                }]
            })
        );

        // ABN AMRO Accounts List tool
        server.tool(
            "abnamro-accounts-list",
            "This tool fetches the list of accounts for the ABN AMRO user. The main account is called 'Personal Account'.",
            {},
            async ({ }) => {
                const url = "https://www-et1.abnamro.nl/my-abnamro/api/payments/contracts/list";
                const response = await fetch(url, {
                    method: 'POST',
                    headers: staticHeaders,
                    body: JSON.stringify({
                        "actionNames": ["VIEW_PORTFOLIO_OVERVIEW", "VIEW_PAYMENTS", "APM_ADVISE_CONTRACTFILTER", "MANAGE_DOMESTIC_PAYMENTS", "MANAGE_INTERNATIONAL_PAYMENTS", "SIGN_DOMESTIC_PAYMENTS", "SIGN_INTERNATIONAL_PAYMENTS", "SIGN_STANDING_ORDER", "VIEW_PROFILE_FUND_SETTINGS", "VIEW_WEALTH_OVERVIEW"],
                        "productBuildingBlocks": [5, 8, 20, 25, 15],
                        "productGroups": ["PAYMENT_ACCOUNTS", "SAVINGS_ACCOUNTS", "INVESTMENTS", "FISCAL_CAPITAL_SOLUTIONS", "FISCAL_CAPITAL_SOLUTIONS_PRODUCTS", "MORTGAGE"],
                        "balanceTypes": ["IBMR", "ITBD"],
                        "excludeBlocked": false,
                        "contractIds": []
                    })
                });
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }
                const result = await response.json();
                console.log(`ABN AMRO Accounts List: ${JSON.stringify(result)}`);
                return {
                    content: [{ type: "text", text: JSON.stringify(result) }]
                };
            },
        );

        // ABN AMRO transactions tool
        server.registerTool(
            "abnamro-transactions",
            {
                description: `Fetches ABN AMRO transactions for a given account number. 
                Use 'lastMutationKey' from the result to fetch older transactions.`,
                inputSchema: {
                    accountNumber: z.string().describe("IBAN account number"),
                    lastMutationKey: z.string().optional().describe("lastMutationKey, used for the next page of mutations")
                }
            },
            async ({ accountNumber, lastMutationKey }) => {
                let url = `https://www-et1.abnamro.nl/mutations/${accountNumber}?accountNumber=${accountNumber}&includeActions=EXTENDED`;
                url += lastMutationKey ? `&lastMutationKey=${lastMutationKey}` : ''
                console.log(`Request URL: ${url}`);
                const response = await fetch(url, {
                    method: 'GET',
                    headers: staticHeaders
                });
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                return {
                    content: [{ type: "text", text: JSON.stringify(data) }]
                };
            }
        );

        // ABN AMRO tasks tool
        server.registerTool(
            "abnamro-tasks",
            {
                description: "Fetches ABN AMRO tasks for the user.",
                inputSchema: {}
            },
            async () => {
                const url = "https://www-et1.abnamro.nl/my-abnamro/apis/bapi/tasks/v2/";
                const response = await fetch(url, {
                    method: 'GET',
                    headers: chasmSpecificHeaders
                });
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                return {
                    content: [{ type: "text", text: JSON.stringify(data) }]
                };
            }
        );

        // ABN AMRO message cards tool
        server.registerTool(
            "abnamro-message-cards",
            {
                description: "Fetches ABN AMRO message cards for the user.",
                inputSchema: {}
            },
            async () => {
                const url = "https://www-et1.abnamro.nl/my-abnamro/api/message-card/v1/message-cards";
                const response = await fetch(url, {
                    method: 'GET',
                    headers: staticHeaders
                });
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                return {
                    content: [{ type: "text", text: JSON.stringify(data) }]
                };
            }
        );

        // ABN AMRO Appointments tool
        server.registerTool(
            "abnamro-appointments",
            {
                description: "Fetches ABN AMRO appointments for the user.",
                inputSchema: {}
            },
            async () => {
                const url = "https://www-et1.abnamro.nl/my-abnamro/apis/party-online-appointment-request/v1/appointments";
                const response = await fetch(url, {
                    method: 'GET',
                    headers: chasmSpecificHeaders
                });
                console.log(`OAM API request : ${response.status} ${response.statusText}`);
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                return {
                    content: [{ type: "text", text: JSON.stringify(data) }]
                };
            }
        );

        const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
        res.on('close', () => {
            transport.close();
            server.close();
        });
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error',
                },
                id: null,
            });
        }
    }
});

app.get('/mcp', async (req: Request, res: Response) => {
    console.log('Received GET MCP request');
    res.writeHead(405).end(JSON.stringify({
        jsonrpc: "2.0",
        error: {
            code: -32000,
            message: "Method not allowed."
        },
        id: null
    }));
});

app.delete('/mcp', async (req: Request, res: Response) => {
    console.log('Received DELETE MCP request');
    res.writeHead(405).end(JSON.stringify({
        jsonrpc: "2.0",
        error: {
            code: -32000,
            message: "Method not allowed."
        },
        id: null
    }));
});

// Start the server
const PORT = 7000;
app.listen(PORT, () => {
    console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
});