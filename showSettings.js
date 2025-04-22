const structure = {
    mcpServers : {
        "composer-ai" : {
            command : "npx",
            args : ['composer-mcp-server']
        }
    }
}

console.log('Copy/Paste into your MCP client:');
console.log(
    JSON.stringify(structure, null, 2)
);
