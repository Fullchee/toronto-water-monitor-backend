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
- testing
  - how to use .env in postman tests?
- psql: investigate why the db tests hang
  - it should be okay, pool.query shouldn't need to close it
- check the gmail for "Address not sent" emails and delete them from the database

Notes

Email
I tried to use nodemailer and SendGrid and it was pretty straightforward.

However, I didn't invest the time to use one of their templates that could use nodemailer.

I don't really care about the extra benefits of SendGrid such as detecting whether a user wants to

It would also add a lot of complexity to the project where I would store email lists in both SendGrid and in my database.

I'm also wary of the 100 daily email limit.

So I decided to implement it myself!

I started with a link that was actually a form with hidden fields.
However, Gmail triggered a security warning when I opened the link and considered it a popup.

I looked at how Mailchimp does it and it just makes a regular GET request with a couple of IDs.

I'm here to learn so I decided to use JWTs! They're URL safe and it's fun to learn!

It turns out thata Mailchimp just does something weird.

They make a GET request which redirects to make a POST request. I decided that doing this wasn't the right thing to do because of the GET specification.

Mailchimp probably does something complex on the backend because having a GET request make a change to the database isn't right according to the GET spec. Browsers will click and prefetch links.
However, I don't want to add that complexity of whatever Mailchimp does so I'm going to keep it simple.
