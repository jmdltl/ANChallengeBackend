## Installation

```bash
$ pnpm install
```

## Updating the Database

```bash
  # create prisma client which is needed to run the server
  $ pnpm run prisma:generate

  # run migrations if needed
  $ pnpm run prisma:migrate

  # update the database with changes you are currently making to your primsa schemas
  $ pnpm run prisma:push
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
