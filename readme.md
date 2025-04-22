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

Once configured, you can interact with your AI assistant in a natural way to install Composer packages:

```
You: Composer AI install laravel/sanctum

AI: [Analyzes the package and provides installation instructions]
To install laravel/sanctum, run the following command:

`composer require laravel/sanctum`

After installation, complete these additional setup steps:
- Run `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"` to publish configuration
- Run `php artisan migrate` to create the required tables
```

Behind the scenes, the AI assistant is using the `install_package` tool:

```
install_package(package="laravel/sanctum", version="^3.0")
```

The tool will:
1. Generate the correct Composer command to install the package
2. Analyze the package's README to extract setup instructions
3. Provide you with a comprehensive guide to complete the installation

## 🧠 How It Works

The Composer MCP Server leverages the Model Context Protocol (MCP) to extend AI assistants with PHP Composer capabilities. When you ask your AI assistant to install a package, the following happens:

1. Your request ("Composer AI install {package_name}") is recognized by the AI
2. The AI calls the `install_package` tool provided by the MCP server
3. The MCP server checks Packagist for the package information
4. It fetches the package's README from GitHub or GitLab
5. It intelligently parses the README to identify installation and setup instructions
6. If the README doesn't contain clear instructions, it falls back to built-in knowledge for common packages
7. The formatted installation and setup instructions are returned to the AI
8. The AI presents this information to you in a helpful, conversational format

This entire process happens in seconds, saving you from having to search documentation and figure out post-installation steps on your own.

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

## 📱 Connect

If you find this tool helpful, feel free to connect with the creator:
- Twitter/X: [@jordankdalton](https://twitter.com/jordankdalton)
- Reddit: [jdcarnivore](https://www.reddit.com/user/jdcarnivore)

---

<p align="center">
  Made with ❤️ for PHP developers
</p>