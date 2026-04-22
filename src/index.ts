import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { query } from './tools/query';
import { execute } from './tools/execute';
import { listTables } from './tools/list_tables';
import { describeTable } from './tools/describe_table';
import { listDatabases } from './tools/list_databases';
import { connect } from './tools/connect';
import { disconnect } from './tools/disconnect';
import { begin_transaction, commit, rollback } from './tools/transaction';
import { MySQLConfig } from './types';

const server = new Server(
  {
    name: 'mysql-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'query',
        description: 'Execute a parameterized SELECT query and return the result set',
        inputSchema: {
          type: 'object',
          properties: {
            sql: { type: 'string', description: 'SQL query string' },
            params: {
              type: 'array',
              description: 'Query parameters for parameterized queries',
              items: { type: 'any' },
            },
          },
          required: ['sql'],
        },
      },
      {
        name: 'execute',
        description: 'Execute a parameterized write operation (INSERT, UPDATE, DELETE)',
        inputSchema: {
          type: 'object',
          properties: {
            sql: { type: 'string', description: 'SQL statement' },
            params: {
              type: 'array',
              description: 'Parameters for parameterized statements',
              items: { type: 'any' },
            },
          },
          required: ['sql'],
        },
      },
      {
        name: 'list_tables',
        description: 'List tables in a database with pagination',
        inputSchema: {
          type: 'object',
          properties: {
            database: { type: 'string', description: 'Database name' },
            limit: { type: 'number', description: 'Maximum number of results', default: 50 },
            offset: { type: 'number', description: 'Number of results to skip', default: 0 },
          },
        },
      },
      {
        name: 'describe_table',
        description: 'Show columns of a table',
        inputSchema: {
          type: 'object',
          properties: {
            table: { type: 'string', description: 'Table name' },
          },
          required: ['table'],
        },
      },
      {
        name: 'list_databases',
        description: 'List databases with pagination',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'number', description: 'Maximum number of results', default: 50 },
            offset: { type: 'number', description: 'Number of results to skip', default: 0 },
          },
        },
      },
      {
        name: 'connect',
        description: 'Establish a connection pool to MySQL',
        inputSchema: {
          type: 'object',
          properties: {
            host: { type: 'string', description: 'MySQL host' },
            port: { type: 'number', description: 'MySQL port' },
            user: { type: 'string', description: 'Database user' },
            password: { type: 'string', description: 'Database password' },
            database: { type: 'string', description: 'Default database' },
            readOnly: { type: 'boolean', description: 'Enable read-only mode' },
            maxRetries: { type: 'number', description: 'Maximum retry attempts', default: 3 },
            retryDelay: { type: 'number', description: 'Retry delay in ms', default: 1000 },
          },
          required: ['host', 'port', 'user', 'password'],
        },
      },
      {
        name: 'disconnect',
        description: 'Close the MySQL connection pool',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'begin_transaction',
        description: 'Start a new transaction',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'commit',
        description: 'Commit the current transaction',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'rollback',
        description: 'Roll back the current transaction',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const params = args as Record<string, any> || {};

  try {
    switch (name) {
      case 'query': {
        const result = await query(params.sql, params.params);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      }
      case 'execute': {
        const result = await execute(params.sql, params.params);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      }
      case 'list_tables': {
        const result = await listTables(params.database, params.limit, params.offset);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      }
      case 'describe_table': {
        const result = await describeTable(params.table);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      }
      case 'list_databases': {
        const result = await listDatabases(params.limit, params.offset);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      }
      case 'connect': {
        const config: MySQLConfig = {
          host: params.host,
          port: params.port,
          user: params.user,
          password: params.password,
          database: params.database,
          readOnly: params.readOnly,
          maxRetries: params.maxRetries,
          retryDelay: params.retryDelay,
        };
        const result = connect(config);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      }
      case 'disconnect': {
        const result = await disconnect();
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      }
      case 'begin_transaction': {
        const result = await begin_transaction();
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      }
      case 'commit': {
        const result = await commit();
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      }
      case 'rollback': {
        const result = await rollback();
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      }
      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: String(error) }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
