# tunnel-ssh-pg *`Example`*

Connect to your PostgreSQL db via Tunnel-SSH.

## Getting Started

**With the help of** `tunnel-ssh`

- Connect to the server using ssh config.
- Forward db host and port to your localhost and localport
- Create a tunnel connection
- Here is the [**README**](https://github.com/agebrock/tunnel-ssh#readme) for `tunnel-ssh` if you need more understanding.

**With the help of** `pg`

- Connect to the database and create a Pool for quick queries
- Here is the [**Documentation**](https://node-postgres.com/) for `pg`. Use to create your own functions.

---

### Install node modules

```bash
npm install
```

#### Create `.env` file in your root folder and paste below environment variables with your values in it

```bash
# YOUR APPLICATION PORT
APP_PORT=""

# KEEP THIS localhost OR CHANGE IT TO YOUR LOCAL HOST
LOCALHOST=""
# YOUR LOCAL POST
LOCALPORT=""

# YOUR SSH SERVER HOST
SERVER_HOST=""
# YOUR SSH SERVER PORT
SERVER_PORT=""
# YOUR SSH SERVER USER NAME
SERVER_USER=""

# YOUR PRIVATE KEY PATH
SSH_PRIVATE_KEY_PATH=""

# YOUR POSTGRESQL HOST
PG_HOST=""
# YOUR POSTGRESQL PORT
PG_PORT=""
# YOUR POSTGRESQL USER
PG_USER=""
# YOUR POSTGRESQL PASSWORD
PG_PASSWORD=""
# YOUR POSTGRESQL DATABASE NAME
PG_DATABASE=""
# YOUR POSTGRESQL CONNECTION TIMEOUT
PG_CONN_TIMEOUT=""
```

*Save your `.env` file.*

---

#### Start your local server

```bash
npm start
```

Open `localhost:<APP_PORT>/health` with your browser or `[GET] localhost:<APP_PORT>/health` API in your Postman to see the result.

Check console logs to see application logs
