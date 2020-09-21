
var temp = console.log;

console.log = (...args) => {
  temp(...args);

  var req = {
    method: 'log',
    args: args,
  };
  window.parent.postMessage(JSON.stringify(req), '*');
};
