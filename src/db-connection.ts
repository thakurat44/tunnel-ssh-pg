import { createTunnel } from "tunnel-ssh"
import { Server } from "net";
import { Pool } from "pg"
import fs from "fs"
import { TunnelStatusEnumType, ResultType } from "./types";

/**
 * Localhost
 */
const localhost = process.env.LOCALHOST

/**
 * Localport
 */
const localport = Number(process.env.LOCALPORT)

/**
 * Tunnel Status
 */
let tunnelStatus: TunnelStatusEnumType = "unset";

/**
 * Tunnel Server
 */
let tunnelServer: Server;

/**
 * Tunnel Server Options
 * 
 * @autoClose "true" will closes the Tunnel-Server once all clients disconnect from the server
 * @autoClose "false" will keep the Tunnel-Server alive until you close it manually
 */
const tunnelOptions = {
  autoClose: true
}

/**
 * SSH Options
 * 
 * @host Your SSH server host
 * @prop Your SSH server port
 * @username Your SSH server user name
 * @privateKey Your SSH private key to connect to the SSH server
 */
const sshOptions = {
  host: process.env.SERVER_HOST,
  port: Number(process.env.SERVER_PORT),
  username: process.env.SERVER_USER,
  privateKey: fs.readFileSync(process.env.SSH_PRIVATE_KEY_PATH),
};

/**
 * Local Server Options.
 * 
 * This is where you can access your SSH server connection in your machine
 * 
 * @host Your local server host
 * @prop Your local server port
 */
const serverOptions = {
  host: localhost,
  port: localport
}

/**
 * Forward Options
 * 
 * Take Postgres connection available in your SSH server and move them to your local server
 * 
 * @srcAddr Your local server host
 * @srcPort Your local server port
 * @dstAddr Postgres connection host from your SSH server
 * @dstPort Postgres connection port from your SSH server
 */
const forwardOptions = {
  srcAddr: localhost,
  srcPort: localport,
  dstAddr: process.env.PG_HOST,
  dstPort: Number(process.env.PG_PORT)
}

/**
 * Postgres Config
 * 
 * Postgres connection from SSH server will be available in your local server after ssh tunneling
 * 
 * @host Postgres host
 * @port Postgres port
 * @user Postgres username
 * @password Postgres password
 * @database Postgres database name
 * @connectionTimeoutMillis Postgres database connection timeout
 */
const pgConfig = {
  host: localhost,
  port: localport,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT)
};

/**
 * Update Tunnel Status
 * 
 * Keeps the information of any open tunnel
 * 
 * @param status Tunnel Status
 * @param server Tunnel Server
 */
export const updateTunnelStatus = (status: TunnelStatusEnumType, server?: Server) => {
  console.log(`Tunnel ${status}`)
  if (status === "created") {
    tunnelServer = server
    tunnelServer.on("close", () => updateTunnelStatus("closed"))
  }
  else if (status === "closed") {
    tunnelServer = undefined
  }
  tunnelStatus = status
}

/**
 * Pool Query Postgres
 * 
 * @param query Query String
 * @returns Rows from table or Empty object
 */
export const poolPostgres = async (query: string) => {
  try {
    console.log('Pooling data from PostgreSQL through SSH tunnel');
    const pool = new Pool(pgConfig);
    const { rows } = await pool.query(query)
    console.log('Pooling done from PostgreSQL through SSH tunnel');
    return rows;
  } catch (poolError) {
    console.error('Connection error', poolError.stack);
    return {};
  }
}

/**
 * Query Postgres
 * 
 * @param query Query String
 * @returns Result
 */
export const queryPostgres = async (query: string) => {
  const result: ResultType = {
    code: 200
  };

  if (tunnelStatus === "creating") {
    console.log("Tunnel creation in progress")
    result.code = 429
    return result
  }

  try {
    if ((tunnelStatus === "unset" || tunnelStatus === "closed") && !tunnelServer) {
      updateTunnelStatus("creating");
      const [server] = await createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
      updateTunnelStatus("created", server);
    }
    const rows = await poolPostgres(query);
    result.data = rows
  } catch (serverError) {
    console.error('Connection error', serverError.stack);
    result.code = 500
  }
  return result
};
