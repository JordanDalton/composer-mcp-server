# 🎼 Composer MCP Server (Unofficial)

<p align="center">
  <img src="https://getcomposer.org/img/logo-composer-transparent.png" alt="Composer Logo" width="200">
</p>

<p align="center">
  <b>Supercharge your PHP development workflow with AI-powered Composer package installation</b>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#setup">Setup</a> •
  <a href="#usage">Usage</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## ✨ Features

- **One-Command Package Installation**: Install any Composer package with a single command
- **Intelligent Setup Instructions**: Automatically extracts setup steps from package READMEs
- **Comprehensive Package Support**: Built-in knowledge of popular Laravel and Symfony packages
- **Time-Saving Guidance**: Never miss a critical post-installation step again

## 🚀 Setup

Getting started with the Composer MCP Server is simple. Just add it to your MCP client configuration (Claude Desktop, Windsurf, Cursor, etc.):

```json
{
  "mcpServers": {
    "composer-ai": {
      "command": "npx",
      "args": [
        "composer-mcp-server"
      ]
    }
  }
}
```

That's it! The NPX command will automatically download and run the Composer MCP Server when needed, with no manual installation required.

## 🔧 Usage

Once configured, you can use the `install_package` tool in your AI assistant:

```
install_package(package="laravel/sanctum", version="^3.0")
```

The tool will:
1. Generate the correct Composer command to install the package
2. Analyze the package's README to extract setup instructions
3. Provide you with a comprehensive guide to complete the installation

## 🧠 How It Works

The Composer MCP Server leverages the Model Context Protocol (MCP) to extend AI assistants with PHP Composer capabilities. When you request a package installation, the server:

1. Checks Packagist for the package information
2. Fetches the package's README from GitHub or GitLab
3. Intelligently parses the README to identify setup instructions
4. Falls back to built-in knowledge for common packages if needed
5. Returns formatted installation and setup instructions

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute to the project:

```bash
# Clone the repository
git clone https://github.com/jordandalton/composer-mcp-server.git

# Navigate to the project directory
cd composer-mcp-server

# Install dependencies and build
yarn install && yarn build
```

Here's how you can help:
- Add support for more PHP packages in the fallback system
- Improve the README parsing algorithm
- Enhance error handling and user feedback
- Expand the tool's capabilities

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<p align="center">
  Made with ❤️ for PHP developers
</p>