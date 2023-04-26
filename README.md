## Description

This is an app built with NestJs to query and save people and planets from the [Star Wars Api](https://swapi.dev/). It uses ExpressJs as an application server and Postgres as a database.

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
and make the necessary modifications to match your Postgres configurations.

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

App will run in `http://localhost:3000`. Swagger documentation can be found in
```bash
http://localhost:3000/api
```

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
