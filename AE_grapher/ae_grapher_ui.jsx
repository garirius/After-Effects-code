{
  function myScript(thisObj){
    function buildUI(thisObj){
      var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "AE Grapher", undefined, {resizeable: true, closeButton: true});

      //function to see if we're inside a comp
      function isThisComp(){
        var curItem = app.project.activeItem;
        // check if comp is selected
        return !(curItem == null || !(curItem instanceof CompItem));
      }

      //function that returns any graphs that are selected
      function selectedGraphs(){
        var curItem = app.project.activeItem;
        var graphBuff = [], lay;

        for(n=0; n<curItem.selectedLayers.length; n++){
          //check every layer individually to see if it is a graph
          lay = curItem.selectedLayers[n];
          if(lay.name.indexOf("| AE Graph") > -1) graphBuff.push(lay);
        }

        return graphBuff;
      }

      //Build UI itself
      var defSize = [22,22];
      myPanel.grp = myPanel.add("group {orientation: 'column'}");
      var panGroup = myPanel.grp;

      //Add graph button
      var addGraphButton = panGroup.add("button", undefined, 'Add Graph')
      addGraphButton.onClick = function(){
        myPanel.close();
      }

      //Graph elements
      var graphElements = panGroup.add("panel", undefined, 'Graph Elements');
      graphElements.alignChildren = 'left';
      var xLabelToggle = false, yLabelToggle = false;
      var xTickToggle = true, yTickToggle = true;
      var xGridToggle = true, yGridToggle = true;
      var secXTickToggle =  false, secYTickToggle =  false;
      var secXGridToggle =  false, secYGridToggle =  false;

      //Adding plot curves
      var plotGroup = graphElements.add("group");
      var addPlotButton = plotGroup.add("button", undefined, '+');
      addPlotButton.size = defSize;
      addPlotButton.onClick = function(){
        myPanel.close();
      }
      var deletePlotButton = plotGroup.add("button", undefined, '-');
      deletePlotButton.size = defSize;
      deletePlotButton.onClick = function(){
        myPanel.close();
      }
      plotGroup.add("statictext", undefined, 'Plot Curves');

      //Adding label toggles
      var labelGroup = graphElements.add("group {orientation: 'row'}");
      var xLabelButton = labelGroup.add("button", undefined, 'X');
      xLabelButton.size = defSize;
      xLabelButton.onClick = function(){
        myPanel.close();
      }
      var yLabelButton = labelGroup.add("button", undefined, 'Y');
      yLabelButton.size = defSize;
      yLabelButton.onClick = function(){
        myPanel.close();
      }
      labelGroup.add("statictext", undefined, 'Axis Labels');

      //Adding tick toggles
      var tickGroup = graphElements.add("group {orientation: 'row'}");
      var xTickButton = tickGroup.add("button", undefined, 'X');
      xTickButton.size = defSize;
      xTickButton.onClick = function(){
        myPanel.close();
      }
      var yTickButton = tickGroup.add("button", undefined, 'Y');
      yTickButton.size = defSize;
      yTickButton.onClick = function(){
        myPanel.close();
      }
      tickGroup.add("statictext", undefined, 'Axis Ticks');

      //Adding grid toggles
      var gridGroup = graphElements.add("group {orientation: 'row'}");
      var xGridButton = gridGroup.add("button", undefined, 'X');
      xGridButton.size = defSize;
      xGridButton.onClick = function(){
        myPanel.close();
      }
      var yGridButton = gridGroup.add("button", undefined, 'Y');
      yGridButton.size = defSize;
      yGridButton.onClick = function(){
        myPanel.close();
      }
      gridGroup.add("statictext", undefined, 'Grid');

      //Secondary tick toggles
      var secTickGroup = graphElements.add("group {orientation: 'row'}");
      var secXTickButton = secTickGroup.add("button", undefined, 'X');
      secXTickButton.size = defSize;
      secXTickButton.onClick = function(){
        myPanel.close();
      }
      var secYTickButton = secTickGroup.add("button", undefined, 'Y');
      secYTickButton.size = defSize;
      secYTickButton.onClick = function(){
        myPanel.close();
      }
      secTickGroup.add("statictext", undefined, 'Secondary Ticks');

      //Adding grid toggles
      var secGridGroup = graphElements.add("group {orientation: 'row'}");
      var secXGridButton = secGridGroup.add("button", undefined, 'X');
      secXGridButton.size = defSize;
      secXGridButton.onClick = function(){
        myPanel.close();
      }
      var secYGridButton = secGridGroup.add("button", undefined, 'Y');
      secYGridButton.size = defSize;
      secYGridButton.onClick = function(){
        myPanel.close();
      }
      secGridGroup.add("statictext", undefined, 'Secondary Grid');

      myPanel.layout.layout(true);

      return myPanel;
    }

    var myPan = buildUI(thisObj);
    if(myPan != null && myPan instanceof Window){
      myPan.center();
      myPan.show();
    }
  }

  myScript(this);
}
