{
  function myScript(thisObj){
    function buildUI(thisObj){
      var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "AE Grapher", undefined, {resizeable: true, closeButton: true});

      var GRAPH_ID_STRING = "AEGRAPH", PLOT_ID_STRING="AEPLOT";
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

      //plot counting stuff
      function countPlots(where){
        var cont = where.property("Contents")("Plots");
        if(cont !== null && cont !== undefined){
          var nam = cont(1).name;
          nam = nam.split(" ");
          return nam[nam.length-1];
        } else {
          return 0;
        }
      }

      function countGraphs(){
        var comp = app.project.activeItem;
        if(comp.numLayers > 0){
          var lays = comp.layers;
          var id=undefined, num = 0;

          for(n=1; n<=comp.numLayers; n++){
            var lay = lays[n];
            //skip layer if it isn't a Shape Layer, it's impossible for it to be a graph
            if(!(lay instanceof ShapeLayer)) continue;

            //if a shape layer has a comment and includes a graph id string we should check it out
            if(lay.comment.indexOf(GRAPH_ID_STRING) >= 0){
              //get the graph number and, if it's bigger than any number we've found, we jot it down
              id = lay.comment.split("-");
              id = parseInt(id[id.length-1]);

              num = (id > num) ? id:num;
            }
          }
          return num;
        } else {
          return 0;
        }
      }

      //function to add a plot
      function addPlot(where){
        //add preset
        if(where !== null){
          var preset = new File("AE Grapher - Function Parameters.ffx");
          if(preset.exists != true){
            preset = findPreset("AE Grapher - Function Parameters");
          }

          where.applyPreset(preset);

          var numPlots = countPlots(where);
          var compItem = where.containingComp;
          var ctrlLay = compItem.layers.addText("return a*Math.exp(-Math.pow(x-b,2)/(2*Math.pow(c,2)));")
          ctrlLay.name = where.name + " - Function " + parseInt(numPlots+1);
          ctrlLay.comment = where.comment + " " + PLOT_ID_STRING + parseInt(numPlots+1);
        } else {
          alert("Please select an AE Graph layer to create the plot in.");
        }
      }

      //function to check if a layer is an AE Graph layer
      function isAEGraph(which){
        return (which instanceof ShapeLayer) && which.comment.indexOf(GRAPH_ID_STRING) >= 0;
      }

      //function to find AE Grapher Presets
      function findPreset(name, where){

        if(typeof where === 'undefined'){
          var possibleFolders = [Folder.appPackage.absoluteURI + "/Presets",
            Folder.appPackage.absoluteURI + "/Presets/AE Grapher",
            PRESETS_FOLDER];
          var n = 0, preset;

          while(n < possibleFolders.length){ //explore default possible folders
            var fol = possibleFolders[n];
            preset = findPreset(name,fol);
            if(preset !== null){
              return preset;
            }
            n++;
          }

          //if it couldn't be found, ask for the path
          alert("Couldn't find AE Grapher Preset folder! Please select folder.\nIn the future, we recommend you add AE Grapher Preset folder to the Presets Folder.");

          myPresetsFolder = Folder(Folder.myDocuments.absoluteURI).selectDlg();

          // Beware, at this stage the variable myPresetsFolder can still be null, if the user was prompted a folder dialog and closed it.
          if(myPresetsFolder === null){
            return null;
          } else {
            preset = findPreset(name,myPresetsFolder.absoluteURI);
            if(preset!==null){
              PRESETS_FOLDER = myPresetsFolder.absoluteURI;
              return preset;
            } else {
              return null;
            }
          }
        } else {
          name = name + ".ffx";
          var presetsFolder = Folder(where);
          var presets = presetsFolder.getFiles(name);

          return (presets.length > 0) ? presets[0]:null;
        }

      }

      //function to delete any layers related to a given layer
      function deleteGraph(which){
        var id = which.comment;
        var comp = which.containingComp;
        which.remove();

        var n=1, lays = comp.layers;
        while(n<=lays.length){
          lay = lays[n];
          if(lay.comment.indexOf(id) >= 0){
            lay.remove();
            lays = comp.layers;
            n = 1;
          } else {
            n++;
          }
        }
      }
      //Build UI itself
      var defSize = [22,22];
      myPanel.grp = myPanel.add("group {orientation: 'column'}");
      var panGroup = myPanel.grp;

      /* ------------ ADD GRAPH BUTTON ----------------- */
      var addGraphButton = panGroup.add("button", undefined, 'Add Graph')
      addGraphButton.onClick = function(){
        app.beginUndoGroup("Add Graph");
        if(isThisComp()){ //check if there's a comp to work in
          var num = countGraphs()+1;
          var curItem = app.project.activeItem;
          var lay = curItem.layers.addShape();
          lay.name = "AE Graph " + num;

          //Add graph controls
          var preset = new File("AE Grapher.ffx");
          if(preset.exists != true){
            preset = findPreset("AE Grapher");
          }
          lay.applyPreset(preset);

          //Add identifier
          lay.comment = GRAPH_ID_STRING + "-" + num;

          //Add plot
          addPlot(lay);
        } else {
          alert("Please select a composition to create the graph in.");
        }
        app.endUndoGroup();
      }

      /* ------------ DELETE GRAPH BUTTON ----------------- */
      var deleteGraphButton = panGroup.add("button", undefined, 'Delete Graph')
      deleteGraphButton.onClick = function(){
        app.beginUndoGroup("Delete Graph");
        if(isThisComp()){ //check if there's a comp to work in
          var com = app.project.activeItem;
          if(com.selectedLayers.length > 0){ //if there are selected layers, check those
            n = 0;
            while(n<com.selectedLayers.length){
              var lay = com.selectedLayers[n];
              if(isAEGraph(lay)) deleteGraph(lay) else n++;
            }
          } else { //otherwise, look for the latest graph
            var id = GRAPH_ID_STRING + "-" + parseInt(countGraphs());
            for(n=1; n<=com.numLayers; n++){
              var lay = com.layers[n];
              if(isAEGraph(lay) && lay.comment == id){
                deleteGraph(lay);
                break;
              }
            }
          }
        } else {
          alert("Please select a composition to delete the graph from.");
        }
        app.endUndoGroup();
      }

      //Graph elements
      var graphElements = panGroup.add("panel", undefined, 'Graph Elements');
      graphElements.alignChildren = 'left';

      //Adding plot curves
      var plotGroup = graphElements.add("group");
      var addPlotButton = plotGroup.add("button", undefined, '+');
      addPlotButton.size = defSize;
      addPlotButton.onClick = function(){
        app.beginUndoGroup("Add Plots");
        if(isThisComp()){ //check if there's a comp to work in
          var com = app.project.activeItem;
          if(com.selectedLayers.length > 0){ //if there are selected layers, check thos

          } else { //otherwise, throw an error
            alert("Please select an AE Graph Layer to add the plot to.")
          }
        } else {
          alert("Please select a composition to create the graph in.");
        }
        app.endUndoGroup();
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
