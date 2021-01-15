# toronto-water-monitor-backend

## Why

A family member got a high water bill from a leaky toilet they didn't notice.

The city of Toronto built a great tool called MyWaterToronto where you can lookup your water usage.

Surprisingly, the city of Toronto doesn't alert you of high usage so I built this tool.

## Tests

They need to be run while the server is running

```sh
jest
```

## Todos

- redirect the home page to the react front end
- unsubscribe: /unsubscribe doesn't seem to work
- unsubscribe: add the email as a search param and pre-populate the form with the user's email
- testing
  - how to use .env in postman tests?
- psql: investigate why the db tests hang
  - it should be okay, pool.query shouldn't need to close it
- check the gmail for "Address not sent" emails and delete them from the database
