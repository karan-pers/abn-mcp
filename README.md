# ABN-MCP

A sample MCP server for handful of actions like fetch transactions for an IBAN and list all accounts. The server is in newer HTTP streamable mode.

## Requirements
Node v22.16.0
pnpm

## Installation

1. **Clone the repository:**

  ```sh
  git clone https://github.com/your-username/abn-mcp.git
  cd abn-mcp
  ```

2. **Install dependencies using [pnpm](https://pnpm.io/):**

  ```sh
  pnpm i
  ```


3. **Run the MCP server using [pnpm](https://pnpm.io/):**

```sh
  pnpm dev
```

4. **Connect using MCP Client**

Then connect to your favorite HTTP streamable MCP client (I use VS Code - Insiders!) with `http://localhost:3000/mcp` as server URL.

Also provide extra headers in the MCP settings.
```
"headers": { "smsession": "<your SMSession cookie here>" }
```

Eventually the MCP configuration should look like
```
{
    "mcp": {
        "servers": {
            "abn-mcp": {
                "url": "http://localhost:3000/mcp",
                "headers": {
                    "smsession": "<your cookie here>"
                }
            }
        }
    }
}
```

## License

Add license information here.