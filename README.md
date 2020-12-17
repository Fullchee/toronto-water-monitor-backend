# toronto-water-monitor-backend

## Tests

They need to be run while the server is running

```sh
jest
```

## Todos

- emailer
  - JWT instead of the two hidden forms
- redirect the home page to the react front end
- testing
  - how to use .env in postman tests?
- psql: investigate why the db tests hang
  - it should be okay, pool.query shouldn't need to close it