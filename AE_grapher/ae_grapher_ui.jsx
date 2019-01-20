{
  function myScript(thisObj){
    function buildUI(thisObj){
      var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "AE Grapher", undefined, {resizeable: true, closeButton: true});

      var GRAPH_ID_STRING = "AEGRAPH", PLOT_ID_STRING="AEPLOT", SECTION_NAME = "AEGrapherSettings", PRESETS_FOLDER="PresetsFolder";
      var COLORS = [[1,0,0,1], [0.5,0.5,0,1], [0,1,0,1], [0,0.5,0.5,1], [0,0,1,1], [0.5,0,0.5,1]];

      /**
       * Gets all layers that match a certain criterium
       *
       * @param {String} str The string we have to look for.
       * @param {(CompItem|Layer[]|LayerCollection)} [where=app.project.activeItem.layers] Layer Collection or Array in which to look for the layers. It checks the whole active comp by default.
       * @example
       * //returns all layers whose comment includes "LAYER"
       * getLayersWithComment("LAYER");
       * @example
       * //returns all selected layers whose comment includes "HI"
       * getLayersWith("HI",app.project.activeItem.selectedLayers);
       * @returns {Layer[]} Returns all layers that match the criteria.
       */
      function getLayersWithComment(str, where){
        if(typeof str === 'string'){
          var layBuff = [], lays, startNum=1, post=1;
          //if no collection is specified, get active comp by default
          if(where === undefined && isThisComp()) where = app.project.activeItem;

          //if we're dealing with a comp we're gonna look at all its layers
          if (where instanceof CompItem) {
            lays = where.layers;
          } else if(where instanceof LayerCollection){
            //if it's a layer collection then we just have to go through where
            lays = where;
          } else if(where instanceof Array && where.every(function(el){return el instanceof Layer;})){
            //if it's a Layer array we have to change the numbering
            lays = where;
            startNum = 0;
            post = 0;
          } else return null;

          var cond;
          for(var n=startNum; n<lays.length+post; n++){
            if(lays[n].comment.indexOf(str) >= 0) layBuff.push(lays[n]);
          }
          return layBuff;
        } else return null;
      }

      /**
       * Checks if a certain layer is an AE Graph
       * @param {Layer} what Layer to check.
       * @returns {Boolean} Whether the layer is an AE Graph.
       */
       function isAEGraph(what){
         return (what instanceof ShapeLayer) && (what.comment.indexOf(GRAPH_ID_STRING) >= 0);
       }
      /**
       * Checks if we're inside a composition.
       * @returns {Boolean} True if activeItem is a comp. False if not.
       */
      function isThisComp(){
        var curItem = app.project.activeItem;
        return !(curItem == null || !(curItem instanceof CompItem));
      }

      /**
       * Gets all selected AE Graph Layers
       * @returns {Layer[]} Returns all selected AE Graph Layers.
       */
      function selectedGraphs(){
        return app.project.activeItem.selectedLayers.filter(function(lay) {return isAEGraph(lay);});
      }

      /**
       * Counts how many plots a certain AE Graph has.
       * @param {Layer} where AE Graph in which to count.
       * @returns {Number|Null} Amount of plots an AE Graph has. null if it's not an AE Graph.
       */
      function countPlots(where){
        if(isAEGraph(where)){
          var cont = where.property("Contents")("Plots")("Contents");
          var res = 0, prop;
          if(cont !== null && cont !== undefined){
            for(var n=1; n<=cont.numProperties; n++){
              prop = cont.property(n);
              alert(prop.name);
              if(prop.name.indexOf(PLOT_ID_STRING) >= 0) res++;
            }
          }
          alert(res);
          return res;
        } else return null;
      }

      /**
       * Counts how many AE Graphs a certain composition has.
       * @returns {Number|Null} Amount of AE Graphs a composition has. Null if not an active comp.
       */
      function countGraphs(){
        if(isThisComp()){
          if(app.project.activeItem.numLayers > 0){
            //get all AE Graphs
            var lays = getLayersWithComment(GRAPH_ID_STRING).filter(function(lay) {return isAEGraph(lay);});
            var id=undefined, num = 0;

            for(var n=0; n<lays.length; n++){
              //get the graph number and, if it's bigger than any number we've found, we jot it down
              id = lays[n].comment.split("-");
              id = parseInt(id[id.length-1]);

              num = (id > num) ? id:num;
            }
            return num;
          } else return 0;
        } else return null;
      }

      /**
       * Adds a plot to an AE Graph
       * @param {Layer} where AE Graph in which to add the plot.
       */
      function addPlot(where){
        //add preset
        if(where !== null && where !== undefined && isAEGraph(where)){
          var numPlots = countPlots(where);
          var preset = new File("AE Grapher - Function Parameters.ffx");
          if(!preset.exists){
            preset = findPreset("AE Grapher - Function Parameters");
          }

          where.applyPreset(preset);
          //sometimes the Function Parameters.ffx preset gets applied twice (dunno why)
          //so we're removing it by hand bc i don't know how to fix it
          var effs = where.effect;
          for(var n=0; n<effs.numProperties; n++){
            eff = effs.property(n+1);
            //if the effect name is not "Function Parameters we're gonna skip it"
            if(eff.name.indexOf("Function Parameters") < 0) continue;

            num = eff.name.split(" ");
            num = parseInt(num[num.length-1]);
            if(num > numPlots+1) eff.remove();
          }

          //Create Text control layer
          var compItem = where.containingComp;
          var ctrlLay = compItem.layers.addText("return a*Math.exp(-Math.pow(x-b,2)/(2*Math.pow(c,2)));")
          ctrlLay.name = where.name + " - Function " + (numPlots+1).toString();
          ctrlLay.comment = where.comment + " " + PLOT_ID_STRING +"-"+ (numPlots+1).toString();

          //move the new text control layer next to any others there might be
          var prevLay = null;
          if(numPlots < 1){
            //get all plot control text layers related to this graph
            var id = where.comment + " " + PLOT_ID_STRING + "-" + numPlots.toString();
            prevLay = getLayersWithComment(id).filter(function(lay){
              return (lay instanceof TextLayer);
            });
            prevLay = (prevLay instanceof Array) ? prevLay[0]:prevLay;
          } else {
            prevLay = where;
          }
          ctrlLay.moveBefore(prevLay);

          //add the actual plot
          var plot = where("Contents")("Plots").addProperty("ADBE Vectors Group");
          var plot2 = plot.addProperty("ADBE Vector Shape - Group");
          plot2.name = PLOT_ID_STRING +"-"+ (numPlots+1).toString();
          var stroke = plot.addProperty("ADBE Vector Graphic - Stroke");
          stroke("Color").setValue(COLORS[numPlots%(COLORS.length)]);
          stroke("Stroke Width").setValue(10);
        } else {
          alert("Please select an AE Graph layer to create the plot in.");
        }
      }

      /**
       * Looks for a given preset
       * @param {String} name Name of the preset.
       * @param {String} [where] URI of the folder in which to look. Not needed if there's already a setting for it or if you want to ask.
       * @returns {File|Null} The preset file if it could be found, null if not.
       */
      function findPreset(name, where){
        var preset;
        if(typeof where === 'undefined'){
          //if there's already a saved setting for the location of the presets, use that
          if(app.settings.haveSetting(SECTION_NAME,PRESETS_FOLDER)){
            preset = findPreset(name, app.settings.getSetting(SECTION_NAME, PRESETS_FOLDER));
            if(preset !== null) return preset;
          }

          //otherwise, go through a couple of basic alternatives
          var possibleFolders = [Folder.appPackage.absoluteURI + "/Presets", Folder.appPackage.absoluteURI + "/Presets/AE Grapher"];

          for(var n=0; n<possibleFolders.length; n++){ //explore default possible folders
            preset = findPreset(name,possibleFolders[n]);
            if(preset !== null){
              //if we found the preset, save its location and return the preset
              app.settings.saveSetting(SECTION_NAME,PRESETS_FOLDER,possibleFolders[n].absoluteURI);
              app.preferences.saveToDisk();
              return preset;
            }
          }

          //if it couldn't be found, ask for the path
          alert("Couldn't find AE Grapher Preset folder! Please select folder.\nIn the future, we recommend you add AE Grapher Preset folder to the Presets Folder.");

          myPresetsFolder = Folder(Folder.myDocuments.absoluteURI).selectDlg();
          if(myPresetsFolder === null){
            return null;
          } else {
            preset = findPreset(name,myPresetsFolder.absoluteURI);
            if(preset!==null){
              app.settings.saveSetting(SECTION_NAME,PRESETS_FOLDER,myPresetsFolder.absoluteURI);
              app.preferences.saveToDisk();
              return preset;
            } else {
              return null;
            }
          }
        } else {
          //if we're instructed to look for the preset specifically somewhere,
          //we check if it's there and if it's not let's just return null
          name = name + ".ffx";
          var presetsFolder = Folder(where);
          var presets = presetsFolder.getFiles(name);

          return (presets.length > 0) ? presets[0]:null;
        }

      }

      /**
       * Delete any layer related to a certain graph
       * @param {Number|Layer} which If it's a number, delete all layers related to the n-th graph. If it's a layer, delete all layers of the same graph.
       */
      function deleteGraph(which){
        var id, lays;
        if(typeof which == 'number' && which > 0 && isThisComp()){
          id = GRAPH_ID_STRING + "-" + which.toString();
        } else if (which instanceof Layer){
          id = which.comment.split(" ")[0];
        } else return;

        var lays = getLayersWithComment(id);
        while(lays.length>0){lays[0].remove(); alert(lays.length);}
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
          if(!preset.exists){
            preset = findPreset("AE Grapher");
          }

          lay.applyPreset(preset);

          //Add identifier
          lay.comment = GRAPH_ID_STRING + "-" + num;

          //Add plot panGrou
          var plotGroup = lay.property("Contents").addProperty("ADBE Vector Group");
          plotGroup.name = "Plots";

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
            for(var n=1; n<=com.numLayers; n++){
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

      /* --------------------------------------------- */
      /* ------------ GRAPH ELEMENTS ----------------- */
      /* --------------------------------------------- */
      var graphElements = panGroup.add("panel", undefined, 'Graph Elements');
      graphElements.alignChildren = 'left';

      /* ------------ ADD PLOT CURVE ----------------- */
      var plotGroup = graphElements.add("group");
      var addPlotButton = plotGroup.add("button", undefined, '+');
      addPlotButton.size = defSize;
      addPlotButton.onClick = function(){
        app.beginUndoGroup("Add Plots");
        if(isThisComp()){ //check if there's a comp to work in
          var com = app.project.activeItem;
          var graphBuff = [];
          if(com.selectedLayers.length > 0){ //if there are selected layers, check those
            for(var n=0; n<com.selectedLayers.length; n++){ //keep only the ones that are AE Graphs
              var lay = com.selectedLayers[n];
              if(isAEGraph(lay)) graphBuff.push(lay);
            }
            if(graphBuff.length > 0) {
              //add a plot in every AE Graph layer we've selected
              for(var n=0; n<graphBuff.length; n++){
                addPlot(graphBuff[n]);
              }
            } else { //if there are no AE Graphs, throw an error
              alert("Please select an AE Graph Layer to add the plot to.");
            }
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
