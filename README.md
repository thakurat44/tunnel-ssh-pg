# tunnel-ssh-pg

Connect to your PostgreSQL db via Tunnel-SSH

## Getting Started

> **With the help of** `tunnel-ssh`

- Connect to the server using ssh config.
- Forward db host and port to your localhost and localport
- Create a tunnel connection

> **With the help of** `pg`

- Connect to the database and create a Pool for quick queries
- Here is the [**Documentation**]([Documentation](https://node-postgres.com/)) for `pg` you can use to create your own functions.

---

### Install node modules

```bash
npm install
```

---

#### Create `.env` file and paste below environment variables with your values in it

```bash
APP_PORT=""

LOCALHOST=""
LOCALPORT=""

SERVER_HOST=""
SERVER_PORT=""
SERVER_USER=""

SSH_PRIVATE_KEY_PATH=""

PG_HOST=""
PG_PORT=""
PG_USER=""
PG_PASSWORD=""
PG_DATABASE=""
PG_CONN_TIMEOUT=""
```

_Save your `.env` file._

---

#### Start your local server

```bash
npm start
```
