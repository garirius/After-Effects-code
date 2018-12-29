{
  function test(){
    var fx, s, n, key;

    if (app.project && app.project.activeItem instanceof CompItem && app.project.activeItem.selectedProperties.length>0 && (fx = app.project.activeItem.selectedProperties[0]).isEffect) {
        s = "for... in...\r";
        for (key in fx) s += "\r" + key;
        alert (s);

        s = "for...in... Own js properties: \r";     // >>> apparently, always empty
        for (key in fx && fx.hasOwnProperty(key)) s += "\r" + key;
        alert (s);

        s = "AE properties: \r";
        for (n =1; n<= fx.numProperties; n++)
          s += "\r" + fx.property(n).matchName;
        alert (s);
      }
    }
    test();
  };
