# toronto-water-monitor-backend

https://toronto-water-monitor.netlify.app/

Get an email notification when your water usage is too high!

## Code

- Front-end

  - GitHub: :octocat: https://github.com/Fullchee/toronto-water-monitor-frontend
  - Netlify: https://toronto-water-monitor.netlify.app/

- Back-end
  - GitHub: :octocat: https://github.com/Fullchee/toronto-water-monitor-backend
  - Heroku: https://toronto-water-monitor.herokuapp.com

## Why

A family member got a high water bill from a leaky toilet they didn't notice.

The city of Toronto has a great tool called [MyWaterToronto](https://www.toronto.ca/services-payments/water-environment/how-to-use-less-water/mywatertoronto/) where you can lookup your water usage.

Surprisingly, the City of Toronto doesn't have a feature to alert you of high usage so I built this tool.

## Installation

1. Install Postgres
   1. (I'm using PostgreSQL 13.1 but another version should be fine, this project is simple)
2. Run `yarn` to install the dependencies
3. Create a file called `.env` in the root of the folder

## Develop

1. Run `yarn start` to start the server

## Support

Raise a GitHub issue if you see a problem!

## Tests

They need to be run while the server is running

```sh
jest
```

https://www.toronto.ca/311/knowledgebase/kb/docs/articles/revenue-services/customer-service/call-centre/call-centre/city-of-toronto-average-water-consumption.html#:~:text=In%202019%2C%20the%20average%20household,litres%20of%20water%20per%20day.

## Sample `.env`

```env
GMAIL_EMAIL=toronto.water.monitor@gmail.com
GMAIL_PASS=email_password

DB_USER=postgres
DB_PASSWORD=""
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=postgres
```

## Todos

- dockerize this repo
- unsubscribe: /unsubscribe doesn't seem to work
- unsubscribe: add the email as a search param and pre-populate the form with the user's email
- testing
  - how to use .env in postman tests?
- psql: investigate why the db tests hang
  - it should be okay, pool.query shouldn't need to close it
- check the gmail for "Address not sent" emails and delete them from the database
- Is heroku data safe? (psql)
