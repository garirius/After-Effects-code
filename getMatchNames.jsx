{
  function test(){
    var fx, s, n, key;
    fx = app.project.activeItem.selectedProperties[0]

    if (app.project && app.project.activeItem instanceof CompItem && app.project.activeItem.selectedProperties.length>0) {
      s = "AE properties of "+ fx.name +" | " + fx.matchName +"\r";
      for (n =1; n<= fx.numProperties; n++){ s += "\r" + fx.property(n).name + "  |  " + fx.property(n).matchName;}

      alert (s);
    }
  }
  test();
}
