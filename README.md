# Human Interest 401(k) Verifier

This tool performs basic verification on how Human Interest reinvests your 401(k) funds after your
company migrates from another 401(k) provider. I created this tool after finding mistakes in
calculations when my 401(k) was migrated from ADP to Human Interest.

Try it out: https://human-interest-verifier.vercel.app/

## Tech Stack

This web tool has no back end, to simplify deployment. I used the following languages, tools, and
frameworks:

* [Next.js React Framework](https://nextjs.org/)
* written in [TypeScript](https://www.typescriptlang.org/)
* tested with [Jest](https://jestjs.io/)
* deployed to [Vercel](https://vercel.com/dashboard)
* linted with [ESLint](https://eslint.org/)
* [Bootstrap](https://getbootstrap.com/)
* [Font Awesome](https://fontawesome.com/)

This repo also includes a tool to import historical mutual fund prices.

* written in [Ruby](https://www.ruby-lang.org/en/)
* linted with [RuboCop](https://github.com/rubocop/rubocop)

## Getting Started

### Requirements

* [Node.js 18](https://nodejs.org)
* [Yarn](https://yarnpkg.com)

### Installing

1. Clone repository
   ```
   git clone https://github.com/kenthu/human-interest-verifier.git
   ```
2. Install dependencies
   ```
   cd human-interest-verifier
   yarn install
   ```

### Running Development Web Server
1. Start server
   ```
   yarn dev
   ```
2. Open http://localhost:3000/

### Run Test Suite
```
yarn test
```

## Importing Mutual Fund Prices

### Requirements

* Ruby 2.7+ (tested with both 2.7.4 and 3.0.2)

### Running Importer

```
cd fund_price_importer/
./import.rb
```

## Considerations for Roadmap

* Set up end-to-end testing (Cypress? Playwright?)
* Set up CI/CD
* Use Lighthouse to optimize performance, accessibility, etc.

## Known Issues

* This tool is dependent on how Human Interest displays transaction data on its web app, and thus,
  may break if Human Interest makes changes.
