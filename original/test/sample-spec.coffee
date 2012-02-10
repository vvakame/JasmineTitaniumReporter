isBrowser = ->
  if window?
    return true
  else
    return false

titaniumOnly = (func)->
  unless isBrowser()
    func()

unless isBrowser()
  @jasmine = require "test/jasmine"
  {@describe, @it, @expect, @spyOn, @xit, @runs, @waits, @waitsFor, @beforeEach, @afterEach, @xdescribe} = @jasmine

describe "JasmineTitaniumReporter example", ->
  it "{} to be defined.", ->
    expect({}).toBeDefined()

  titaniumOnly ->

    it "network access. get twitter public timeline.", ->
      xhr = Titanium.Network.createHTTPClient()
      xhr.open "GET", "https://api.twitter.com/1/statuses/public_timeline.json"

      result = null
    
      xhr.onload = ->
        Ti.API.debug this.getResponseHeader("Content-Type")
        Ti.API.debug @responseData.text
        result = JSON.parse @responseData.text
    
      xhr.send()

      waitsFor (-> result), 5000
      runs ->
        for tweet in result
          expect(tweet.user).toBeDefined()
          expect(tweet.text).toBeDefined()

  it "failure", ->
    expect(false).toBeTruthy()
