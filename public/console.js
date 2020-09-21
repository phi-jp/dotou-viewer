

// console のメソッドを overlap して親フレームに post message する
['log', 'dir'].forEach((method) => {
  var temp = console[method];

  console[method] = (...args) => {
    temp(...args);
  
    var req = {
      method: method,
      args: args,
    };
    window.parent.postMessage(JSON.stringify(req), '*');
  };
});
