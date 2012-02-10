debug = false

baseFontSize = 15

exports.setDebugOutput = (b)->
  debug = b
  return

log = (str)->
  if debug
    Ti.API.debug str
  return

dumpRunner = (runner)->
  dumpSuites runner.suites()
  return

dumpSuites = (suites)->
  dumpSuite suite for suite in suites
  return

dumpSuite = (suite)->
  log "  suite description=#{suite.description}"
  log "  suite fullname=#{suite.getFullName()}"
  return

dumpSpecs = (specs)->
  dumpSpec spec for spec in specs
  return

dumpSpec = (spec)->
  log "  spec description=#{spec.description}"
  return

dumpResults = (results)->
  log "  results passed=#{results.passed()}"
  return

dumpResult = (result)->
  log "  result type=#{result.type}"
  if result.type == "log"
  else if result.type == "expect" && result.passed?()
    if result.trace.stack?
      log "  result trace=#{result.trace.stack}"

  return

getDepth = (suite, depth)->
  depth = depth || 1

  if suite.parentSuite?
    return getDepth suite.parentSuite, depth + 1
  else
    return depth

table = Ti.UI.createTableView
  backgroundColor: 'white'
  headerTitle: "Jasmine"
  font:
    fontSize: baseFontSize * 2

addSuite = (suite)->
  label = suite.description

  row = Ti.UI.createTableViewRow()
  row.add Ti.UI.createLabel
    layout: "horizontal"
    text: label
    font:
      fontSize: baseFontSize * 1.5
      fontWeight: "bold"
    left: 50 * getDepth suite
  table.appendRow row
  return

addResult = (suite, result)->
  label = result.description
  color = if result.passed()
    "#83ccd2" #白群色
  else
    "#f4b3c2" #鴇色

  unless result.description?
    # 謎…
    return false

  row = Ti.UI.createTableViewRow()
  row.add Ti.UI.createLabel
    layout: "horizontal"
    text: label
    backgroundColor: color
    font:
      fontSize: baseFontSize
    left: 50 * (1 + getDepth suite)
  table.appendRow row
  return true

isSuccessResult = (result)->
  if result.description? && result.passed()
    return true
  else
    return false

isFailureResult = (result)->
  if result.description? && ! result.passed()
    return true
  else
    return false

createReporterClass = (window, jasminePath)->
  jasminePath = jasminePath || "jasmine"

  {jasmine} = require jasminePath

  window.add table

  class TitaniumReporter extends jasmine.Reporter

    reportRunnerStarting: (runner)=>
      log "jasmine.Reporter#reportRunnerStarting called."
      dumpRunner runner

      log "jasmine version=#{runner.env.versionString()}"

      table.headerTitle = "jasmine #{runner.env.versionString()}"

      return

    reportSpecStarting: (spec)=>
      log "jasmine.Reporter#reportSpecStarting called."
      dumpSpec spec

      return

    reportRunnerResults: (runner)=>
      log "jasmine.Reporter#reportRunnerResults called."
      dumpRunner runner

      testCount = 0
      successCount = 0
      failureCount = 0

      for suite in runner.suites()
        addSuite suite

        for result in suite.results().getItems()
          addResult suite, result
          if isSuccessResult result
            testCount++
            successCount++
          else if isFailureResult result
            testCount++
            failureCount++

      table.headerTitle += " test #{testCount}, success #{successCount}, failure #{failureCount}"

      return

    reportSuiteResults: (suite)=>
      log "jasmine.Reporter#reportSuiteResults called."
      dumpSuite suite

      # addSuite suite.description

      return

    reportSpecResults: (spec)=>
      log "jasmine.Reporter#reportSpecResults called."
      dumpSpec spec

      # addSpec spec.description

      return

    log: (str)=>
      log "log called."
      log str

      return

  return TitaniumReporter

exports.createReporterClass = createReporterClass