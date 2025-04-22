import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from 'axios';

// Create an MCP server
const server = new McpServer({
  name: "ComposerMCP",
  version: "1.0.0"
});

// Tool: Install Composer Package
server.tool("install_package",
  {
    package: z.string().describe("The package name to install"),
    version: z.string().optional().describe("The version of the package to install")
  },
  async (args, extra) => {
    try {
      const packageName = args.package;
      const version = args.version;
      
      // Prepare installation command
      let installCommand = `composer require ${packageName}`;
      if (version) {
        installCommand += `:${version}`;
      }
      
      // Since we can't directly execute shell commands in this environment,
      // we'll simulate the process and provide instructions
      
      const setupSteps = await determineSetupSteps(packageName);
      
      const installInstructions = `To install ${packageName}${version ? ` (${version})` : ''}, run the following command:\n\n\`\`\`\n${installCommand}\n\`\`\``;
      
      let setupInstructions = '';
      if (setupSteps.length > 0) {
        setupInstructions = `\n\nAfter installation, complete these additional setup steps:\n${setupSteps.join('\n')}`;
      }
      
      return {
        content: [
          { 
            type: "text", 
            text: installInstructions + setupInstructions
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [{ 
          type: "text", 
          text: `Error: ${error.message}` 
        }]
      };
    }
  }
);

// Helper function to determine setup steps for common packages
async function determineSetupSteps(packageName: string): Promise<string[]> {
  const steps: string[] = [];
  
  try {
    // First, try to fetch the README from Packagist
    const packageInfo = await fetchPackageInfo(packageName);
    
    if (packageInfo && packageInfo.repository) {
      // Extract repository URL
      const repoUrl = packageInfo.repository;
      
      // Determine if it's GitHub, GitLab, or other
      if (repoUrl.includes('github.com')) {
        const readmeContent = await fetchGitHubReadme(repoUrl);
        if (readmeContent) {
          const extractedSteps = extractSetupStepsFromReadme(readmeContent, packageName);
          if (extractedSteps.length > 0) {
            return extractedSteps;
          }
        }
      } else if (repoUrl.includes('gitlab.com')) {
        const readmeContent = await fetchGitLabReadme(repoUrl);
        if (readmeContent) {
          const extractedSteps = extractSetupStepsFromReadme(readmeContent, packageName);
          if (extractedSteps.length > 0) {
            return extractedSteps;
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error fetching package info: ${error}`);
    // Fall back to hardcoded steps if there's an error
  }
  
  // Fallback: Add package-specific setup instructions for common packages
  switch (packageName) {
    case 'laravel/laravel':
      steps.push('- Run `php artisan key:generate` to set the application key');
      steps.push('- Configure your .env file with database credentials');
      steps.push('- Run `php artisan migrate` to set up the database');
      break;
    case 'symfony/symfony':
      steps.push('- Configure your .env file with necessary environment variables');
      steps.push('- Run `php bin/console cache:clear` to clear the cache');
      break;
    case 'phpunit/phpunit':
      steps.push('- Create or update phpunit.xml configuration file');
      break;
    case 'laravel/framework':
      steps.push('- Configure your .env file with necessary environment variables');
      steps.push('- Run `php artisan migrate` to set up the database');
      break;
    case 'laravel/sanctum':
      steps.push('- Run `php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"` to publish configuration');
      steps.push('- Run `php artisan migrate` to create the required tables');
      break;
    case 'laravel/jetstream':
      steps.push('- Run `php artisan jetstream:install livewire` or `php artisan jetstream:install inertia` based on your preference');
      steps.push('- Run `npm install && npm run dev` to compile assets');
      break;
    case 'laravel/breeze':
      steps.push('- Run `php artisan breeze:install` to scaffold authentication');
      steps.push('- Run `npm install && npm run dev` to compile assets');
      break;
    case 'laravel/horizon':
      steps.push('- Run `php artisan horizon:install` to publish the Horizon configuration');
      steps.push('- Configure your queue connection in .env file');
      break;
    case 'laravel/telescope':
      steps.push('- Run `php artisan telescope:install` to publish the Telescope configuration');
      steps.push('- Run `php artisan migrate` to create the required tables');
      break;
    // Add more packages and their setup steps as needed
  }
  
  return steps;
}

// Function to fetch package information from Packagist
async function fetchPackageInfo(packageName: string): Promise<any> {
  try {
    const response = await axios.get(`https://packagist.org/packages/${packageName}.json`);
    if (response.data && response.data.package) {
      return response.data.package;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching package info from Packagist: ${error}`);
    return null;
  }
}

// Function to fetch README from GitHub repository
async function fetchGitHubReadme(repoUrl: string): Promise<string | null> {
  try {
    // Extract owner and repo from URL
    // Example: https://github.com/laravel/laravel -> laravel/laravel
    const match = repoUrl.match(/github\.com\/([^\/]+\/[^\/]+)/);
    if (!match) return null;
    
    const repo = match[1];
    const apiUrl = `https://api.github.com/repos/${repo}/readme`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching README from GitHub: ${error}`);
    return null;
  }
}

// Function to fetch README from GitLab repository
async function fetchGitLabReadme(repoUrl: string): Promise<string | null> {
  try {
    // Extract project ID from URL
    // Example: https://gitlab.com/namespace/project -> namespace/project
    const match = repoUrl.match(/gitlab\.com\/([^\/]+\/[^\/]+)/);
    if (!match) return null;
    
    const projectId = encodeURIComponent(match[1]);
    const apiUrl = `https://gitlab.com/api/v4/projects/${projectId}/repository/files/README.md/raw`;
    
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error(`Error fetching README from GitLab: ${error}`);
    return null;
  }
}

// Function to extract setup steps from README content
function extractSetupStepsFromReadme(readmeContent: string, packageName: string): string[] {
  const steps: string[] = [];
  
  // Look for common installation/setup sections in the README
  const sections = [
    'Installation', 'Setup', 'Getting Started', 'Usage', 'Configuration',
    'Quick Start', 'Post-Installation', 'After Installation'
  ];
  
  // Split README into lines for analysis
  const lines = readmeContent.split('\n');
  
  let inRelevantSection = false;
  let sectionContent: string[] = [];
  
  // Process the README line by line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this line is a section header
    const isHeader = /^#+\s+(.+)$/.test(line);
    if (isHeader) {
      // If we were in a relevant section, process the collected content
      if (inRelevantSection && sectionContent.length > 0) {
        const extractedSteps = processSection(sectionContent);
        steps.push(...extractedSteps);
        sectionContent = [];
      }
      
      // Check if this header is for a relevant section
      inRelevantSection = sections.some(section => 
        line.toLowerCase().includes(section.toLowerCase())
      );
      
      continue;
    }
    
    // If we're in a relevant section, collect the line
    if (inRelevantSection) {
      sectionContent.push(line);
    }
  }
  
  // Process any remaining section content
  if (inRelevantSection && sectionContent.length > 0) {
    const extractedSteps = processSection(sectionContent);
    steps.push(...extractedSteps);
  }
  
  // If no steps were found, try a more general approach
  if (steps.length === 0) {
    // Look for command lines that might be setup steps
    const commandRegex = /`(php artisan|composer|npm|yarn|\.\/artisan)\s+([^`]+)`/g;
    let match;
    const commands = new Set<string>();
    
    while ((match = commandRegex.exec(readmeContent)) !== null) {
      const command = match[0];
      if (!command.includes('require') && !command.includes('install')) {
        commands.add(`- Run ${command}`);
      }
    }
    
    commands.forEach(command => steps.push(command));
  }
  
  return steps;
}

// Process a section of the README to extract setup steps
function processSection(sectionLines: string[]): string[] {
  const steps: string[] = [];
  
  // Join lines to handle multi-line commands or instructions
  const sectionText = sectionLines.join('\n');
  
  // Look for numbered or bulleted lists
  const listItemRegex = /^(\d+\.|\*|-)\s+(.+)$/gm;
  let match;
  
  while ((match = listItemRegex.exec(sectionText)) !== null) {
    const item = match[2].trim();
    
    // Skip items that are too short or don't seem like instructions
    if (item.length < 10) continue;
    
    // Format as a step
    steps.push(`- ${item}`);
  }
  
  // Look for code blocks that might contain commands
  const codeBlockRegex = /```(?:bash|shell|php|sh)?\n([\s\S]+?)\n```/g;
  while ((match = codeBlockRegex.exec(sectionText)) !== null) {
    const codeBlock = match[1].trim();
    const commandLines = codeBlock.split('\n');
    
    for (const line of commandLines) {
      const trimmedLine = line.trim();
      // Skip comments, empty lines, or very short commands
      if (trimmedLine.startsWith('#') || trimmedLine.length < 5) continue;
      
      // Format as a step
      steps.push(`- Run \`${trimmedLine}\``);
    }
  }
  
  // Look for inline code that might be commands
  const inlineCodeRegex = /`([^`]+)`/g;
  while ((match = inlineCodeRegex.exec(sectionText)) !== null) {
    const code = match[1].trim();
    
    // Only include if it looks like a command (contains spaces and is not too short)
    if (code.includes(' ') && code.length > 10 && 
        (code.includes('php') || code.includes('composer') || code.includes('artisan'))) {
      steps.push(`- Run \`${code}\``);
    }
  }
  
  return steps;
}

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);