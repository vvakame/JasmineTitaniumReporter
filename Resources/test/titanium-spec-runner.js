(function() {
  var TitaniumReporter, jasmine, reporter, window;

  jasmine = require("test/jasmine").jasmine;

  reporter = require("test/jasmine-titanium-reporter");

  window = Ti.UI.currentWindow;

  TitaniumReporter = reporter.createReporterClass(window, "test/jasmine");

  require("test/sample-spec");

  jasmine.getEnv().addReporter(new TitaniumReporter());

  jasmine.getEnv().execute();

}).call(this);
