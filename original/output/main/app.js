(function() {
  var window;

  window = Ti.UI.createWindow({
    url: "test/titanium-spec-runner.js",
    navBarHidden: true,
    exitOnClose: true
  });

  window.open();

}).call(this);
