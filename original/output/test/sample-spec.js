(function() {
  var isBrowser, titaniumOnly, _ref;

  isBrowser = function() {
    if (typeof window !== "undefined" && window !== null) {
      return true;
    } else {
      return false;
    }
  };

  titaniumOnly = function(func) {
    if (!isBrowser()) return func();
  };

  if (!isBrowser()) {
    this.jasmine = require("test/jasmine");
    _ref = this.jasmine, this.describe = _ref.describe, this.it = _ref.it, this.expect = _ref.expect, this.spyOn = _ref.spyOn, this.xit = _ref.xit, this.runs = _ref.runs, this.waits = _ref.waits, this.waitsFor = _ref.waitsFor, this.beforeEach = _ref.beforeEach, this.afterEach = _ref.afterEach, this.xdescribe = _ref.xdescribe;
  }

  describe("JasmineTitaniumReporter example", function() {
    it("{} to be defined.", function() {
      return expect({}).toBeDefined();
    });
    titaniumOnly(function() {
      return it("network access. get twitter public timeline.", function() {
        var result, xhr;
        xhr = Titanium.Network.createHTTPClient();
        xhr.open("GET", "https://api.twitter.com/1/statuses/public_timeline.json");
        result = null;
        xhr.onload = function() {
          Ti.API.debug(this.getResponseHeader("Content-Type"));
          Ti.API.debug(this.responseData.text);
          return result = JSON.parse(this.responseData.text);
        };
        xhr.send();
        waitsFor((function() {
          return result;
        }), 5000);
        return runs(function() {
          var tweet, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = result.length; _i < _len; _i++) {
            tweet = result[_i];
            expect(tweet.user).toBeDefined();
            _results.push(expect(tweet.text).toBeDefined());
          }
          return _results;
        });
      });
    });
    return it("failure", function() {
      return expect(false).toBeTruthy();
    });
  });

}).call(this);
