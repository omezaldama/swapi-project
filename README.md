## Description

This is an app built with NestJs (Typescript) to query and save people and planets from the [Star Wars Api](https://swapi.dev/). It uses a Postgres database.

## Installation

Clone the repository
```bash
git clone git@github.com:omezaldama/swapi-project.git
```

Cd into the repo
```bash
cd swapi-project
```

Copy the environment variables file
```bash
cp .env.example .env
```
and make the necessary modifications to match your Postgres connection configurations.

Install dependencies
```bash
npm install
```

## Running the app

Once you have installed the app, you can run with:
```bash
# development
npm run start

# listen for changes
npm run start:dev
```

App will run in `http://localhost:3000`. Open API (Swagger) documentation can be found in
```bash
http://localhost:3000/api
```

The app has two modules: Planets and People. Both have 2 GET endpoints, one to obtain a number of pages of data from Swapi, and another one to obtain a specific item from the database if it has been queried before or from Swapi otherwise. Additionally, the people module has a POST endpoint that saves a person into the database.

The app connects to a Postgres database; the username, password, etc., can be configured by environment variables using a .env file. There are two models: Person and Planet, and their corresponding tables are created: person and planet, respectively; the ORM used is TypeORM.

## Unit testing

Run tests with
```bash
npm run test
```

## SQL Query

```bash
SELECT DISTINCT ON (year, month)
	EXTRACT(YEAR FROM orders.orderdate) AS year,
	EXTRACT(MONTH FROM orders.orderdate) AS month,
	orders.customerid,
	SUM(order_details.unitprice * order_details.quantity) AS total_monthly_cost
FROM orders
LEFT JOIN order_details
ON public.orders.orderid = order_details.orderid
GROUP BY orders.customerid, month, year
ORDER BY year, month ASC
```
