(function() {
  var addResult, addSuite, baseFontSize, createReporterClass, debug, dumpResult, dumpResults, dumpRunner, dumpSpec, dumpSpecs, dumpSuite, dumpSuites, getDepth, isFailureResult, isSuccessResult, log, table,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  debug = false;

  baseFontSize = 15;

  exports.setDebugOutput = function(b) {
    debug = b;
  };

  log = function(str) {
    if (debug) Ti.API.debug(str);
  };

  dumpRunner = function(runner) {
    dumpSuites(runner.suites());
  };

  dumpSuites = function(suites) {
    var suite, _i, _len;
    for (_i = 0, _len = suites.length; _i < _len; _i++) {
      suite = suites[_i];
      dumpSuite(suite);
    }
  };

  dumpSuite = function(suite) {
    log("  suite description=" + suite.description);
    log("  suite fullname=" + (suite.getFullName()));
  };

  dumpSpecs = function(specs) {
    var spec, _i, _len;
    for (_i = 0, _len = specs.length; _i < _len; _i++) {
      spec = specs[_i];
      dumpSpec(spec);
    }
  };

  dumpSpec = function(spec) {
    log("  spec description=" + spec.description);
  };

  dumpResults = function(results) {
    log("  results passed=" + (results.passed()));
  };

  dumpResult = function(result) {
    log("  result type=" + result.type);
    if (result.type === "log") {} else if (result.type === "expect" && (typeof result.passed === "function" ? result.passed() : void 0)) {
      if (result.trace.stack != null) log("  result trace=" + result.trace.stack);
    }
  };

  getDepth = function(suite, depth) {
    depth = depth || 1;
    if (suite.parentSuite != null) {
      return getDepth(suite.parentSuite, depth + 1);
    } else {
      return depth;
    }
  };

  table = Ti.UI.createTableView({
    backgroundColor: 'white',
    headerTitle: "Jasmine",
    font: {
      fontSize: baseFontSize * 2
    }
  });

  addSuite = function(suite) {
    var label, row;
    label = suite.description;
    row = Ti.UI.createTableViewRow();
    row.add(Ti.UI.createLabel({
      layout: "horizontal",
      text: label,
      font: {
        fontSize: baseFontSize * 1.5,
        fontWeight: "bold"
      },
      left: 50 * getDepth(suite)
    }));
    table.appendRow(row);
  };

  addResult = function(suite, result) {
    var color, label, row;
    label = result.description;
    color = result.passed() ? "#83ccd2" : "#f4b3c2";
    if (result.description == null) return false;
    row = Ti.UI.createTableViewRow();
    row.add(Ti.UI.createLabel({
      layout: "horizontal",
      text: label,
      backgroundColor: color,
      font: {
        fontSize: baseFontSize
      },
      left: 50 * (1 + getDepth(suite))
    }));
    table.appendRow(row);
    return true;
  };

  isSuccessResult = function(result) {
    if ((result.description != null) && result.passed()) {
      return true;
    } else {
      return false;
    }
  };

  isFailureResult = function(result) {
    if ((result.description != null) && !result.passed()) {
      return true;
    } else {
      return false;
    }
  };

  createReporterClass = function(window, jasminePath) {
    var TitaniumReporter, jasmine;
    jasminePath = jasminePath || "jasmine";
    jasmine = require(jasminePath).jasmine;
    window.add(table);
    TitaniumReporter = (function(_super) {

      __extends(TitaniumReporter, _super);

      function TitaniumReporter() {
        this.log = __bind(this.log, this);
        this.reportSpecResults = __bind(this.reportSpecResults, this);
        this.reportSuiteResults = __bind(this.reportSuiteResults, this);
        this.reportRunnerResults = __bind(this.reportRunnerResults, this);
        this.reportSpecStarting = __bind(this.reportSpecStarting, this);
        this.reportRunnerStarting = __bind(this.reportRunnerStarting, this);
        TitaniumReporter.__super__.constructor.apply(this, arguments);
      }

      TitaniumReporter.prototype.reportRunnerStarting = function(runner) {
        log("jasmine.Reporter#reportRunnerStarting called.");
        dumpRunner(runner);
        log("jasmine version=" + (runner.env.versionString()));
        table.headerTitle = "jasmine " + (runner.env.versionString());
      };

      TitaniumReporter.prototype.reportSpecStarting = function(spec) {
        log("jasmine.Reporter#reportSpecStarting called.");
        dumpSpec(spec);
      };

      TitaniumReporter.prototype.reportRunnerResults = function(runner) {
        var failureCount, result, successCount, suite, testCount, _i, _j, _len, _len2, _ref, _ref2;
        log("jasmine.Reporter#reportRunnerResults called.");
        dumpRunner(runner);
        testCount = 0;
        successCount = 0;
        failureCount = 0;
        _ref = runner.suites();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          suite = _ref[_i];
          addSuite(suite);
          _ref2 = suite.results().getItems();
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            result = _ref2[_j];
            addResult(suite, result);
            if (isSuccessResult(result)) {
              testCount++;
              successCount++;
            } else if (isFailureResult(result)) {
              testCount++;
              failureCount++;
            }
          }
        }
        table.headerTitle += " test " + testCount + ", success " + successCount + ", failure " + failureCount;
      };

      TitaniumReporter.prototype.reportSuiteResults = function(suite) {
        log("jasmine.Reporter#reportSuiteResults called.");
        dumpSuite(suite);
      };

      TitaniumReporter.prototype.reportSpecResults = function(spec) {
        log("jasmine.Reporter#reportSpecResults called.");
        dumpSpec(spec);
      };

      TitaniumReporter.prototype.log = function(str) {
        log("log called.");
        log(str);
      };

      return TitaniumReporter;

    })(jasmine.Reporter);
    return TitaniumReporter;
  };

  exports.createReporterClass = createReporterClass;

}).call(this);
