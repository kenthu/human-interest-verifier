#!/usr/bin/env ruby
# frozen_string_literal: true

require 'csv'
require 'json'
require 'net/http'
require 'uri'

# Download historical prices for mutual funds supported by Human Interest, from 1/1/2017 (before
# they started business), until today

# These are the funds available for purchase in Human Interest, as of October 2021
FUND_SYMBOLS = %w[CSVIX CVMRX DFISX DFSPX GCVIX LHYVX MPHQX PDGIX TBCIX TROIX TRPSX TSBIX VBILX VBIRX VBTLX VEMAX VFIAX VFTAX VGSLX VIMAX VMGMX VMVAX VSMAX VSTCX VTABX VTAPX VTIAX VTSAX].freeze

# 1/1/2017
START_TIMESTAMP = 1483228800
END_TIMESTAMP = Time.now.to_i

OUTPUT_PATH = '../src/prices.json'.freeze

def import_fund_prices(fund, prices)
  # Headers obtained from Firefox dev tools as curl command, then converted using https://jhawthorn.github.io/curl-to-ruby/
  uri = URI.parse("https://query1.finance.yahoo.com/v7/finance/download/#{fund}?period1=#{START_TIMESTAMP}&period2=#{END_TIMESTAMP}&interval=1d&events=history&includeAdjustedClose=true")
  request = Net::HTTP::Get.new(uri)
  request['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:92.0) Gecko/20100101 Firefox/92.0'
  request['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
  request['Accept-Language'] = 'en-US,en;q=0.5'
  request['Referer'] = "https://finance.yahoo.com/quote/#{fund}/history?period1=#{START_TIMESTAMP}&period2=#{END_TIMESTAMP}&interval=1d&filter=history&frequency=1d&includeAdjustedClose=true"
  request['Dnt'] = '1'
  request['Connection'] = 'keep-alive'
  request['Upgrade-Insecure-Requests'] = '1'
  request['Sec-Fetch-Dest'] = 'document'
  request['Sec-Fetch-Mode'] = 'navigate'
  request['Sec-Fetch-Site'] = 'same-site'
  request['Sec-Fetch-User'] = '?1'
  request['Te'] = 'trailers'
  req_options = { use_ssl: uri.scheme == 'https' }
  response = Net::HTTP.start(uri.hostname, uri.port, req_options) { |http| http.request(request) }

  abort("Unable to download price data for fund #{fund}") if response.code != '200'
  price_data = CSV.parse(response.body, headers: true)

  headers = price_data.headers()
  abort('Price data is missing Date column') unless headers.include?('Date')
  abort('Price data is missing Close column') unless headers.include?('Close')

  price_data.by_row!
  price_data.each do |row|
    date = row['Date']
    price = row['Close']
    prices[date] = {} unless prices.key?(date)
    prices[date][fund] = price.to_f.round(2) unless price == 'null'
  end

  sleep(1)
end

# Output as JS object literal
def write_to_file(prices)
  File.open(OUTPUT_PATH, 'w') do |f|
    f.write(prices.to_json)
  end
end

prices = {}

FUND_SYMBOLS.each do |fund|
  import_fund_prices(fund, prices)
end

write_to_file(prices)
