# toronto-water-monitor-backend

https://toronto-water-monitor.netlify.app/

Get an email notification when your water usage is too high!

## Code

- Front-end: https://github.com/Fullchee/toronto-water-monitor-frontend
- Back-end: https://github.com/Fullchee/toronto-water-monitor-backend


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
- testing
  - how to use .env in postman tests?
- psql: investigate why the db tests hang
  - it should be okay, pool.query shouldn't need to close it
- check the gmail for "Address not sent" emails and delete them from the database
- Swagger Fu document a rest api?
- Is heroku data safe? (psql)
