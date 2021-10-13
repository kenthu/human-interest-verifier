# Human Interest 401(k) Verifier

This tool performs basic verification on how Human Interest reinvests your 401(k) funds after your
company migrates from another 401(k) provider. I created this tool after finding mistakes in
calculations when my 401(k) was migrated from ADP to Human Interest.

Try it out: https://kenthu.github.io/human-interest-verifier/

## Tech Stack

This is a simple web tool with no back end (to simplify deployment), written in JavaScript, tested
with Jest, bundled with webpack, and deployed to GitHub Pages. Other tools/frameworks used: ESLint,
Bootstrap, Font Awesome

It includes a separate tool written in Ruby to import historical mutual fund prices for
verification.

## Getting Started

### Requirements

* [Node.js](https://nodejs.org)
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
   yarn run start
   ```
2. Open http://localhost:8080/

### Run Test Suite
```
yarn run test
```

### Deploy to GitHub Pages

1. Change mode from `development` to `production` in webpack.config.js
2. Build (which populates the `dist/` directory)
   ```
   yarn run build
   ```
3. Push to GitHub Pages
   ```
   yarn run deploy
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

* Set up end-to-end testing (e.g., with Cypress)
* Rewrite in React
* Rewrite in TypeScript
* Set up CI/CD
* Use Lighthouse to optimize performance, accessibility, etc.

## Known Issues

* Sentry, the error-tracking platform, does not work when the uBlock Origin browser extension is
  installed
* This tool is dependent on how Human Interest displays transaction data on its web app, and thus,
  may break if Human Interest makes changes.
