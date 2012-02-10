{jasmine} = require "test/jasmine"
reporter = require "test/jasmine-titanium-reporter"

window = Ti.UI.currentWindow

# reporter.setDebugOutput true
TitaniumReporter = reporter.createReporterClass(window, "test/jasmine")

require "test/sample-spec"

jasmine.getEnv().addReporter(new TitaniumReporter());
jasmine.getEnv().execute();
