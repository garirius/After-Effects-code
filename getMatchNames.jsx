{
  function test(){
    var fx, s, n, key;

    if (app.project && app.project.activeItem instanceof CompItem && app.project.activeItem.selectedProperties.length>0) {
        fx = app.project.activeItem.selectedProperties[0];
        s = fx.name + " belongs to:\r";

        for(n=1; n<=fx.propertyDepth; n++){
          s += fx.propertyGroup(n).name + " < ";
        }
        s += "\rAE properties of: " + fx.name + "\r";
        for (n =1; n<= fx.numProperties; n++)
          s += "\r" + fx.property(n).matchName;

        alert(s);
      }
    }
    test();
  };
