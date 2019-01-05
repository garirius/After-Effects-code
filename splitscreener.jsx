{
	function myScript(thisObj){
    app.beginUndoGroup("Split-Screener");
    var curItem = app.project.activeItem;

    // check if comp is selected
    if (curItem == null || !(curItem instanceof CompItem)){
      // if no comp selected, display an alert
      alert("Please get into a composition and run the script again.");
    } else {
      // get selected layers
      var effectsGroup = curItem.selectedLayers;
			var n = effectsGroup.length;

      if(n <= 0){ //if no layers selected, display alert
        alert("Please select some layers to splitscreen or whatever.")
      } else {
        //NOW we can get down to business
        //First we create a NULL object which  will hold the splitscreen controls
        var ctrlLayer = curItem.layers.addNull();
				ctrlLayer.name = "SplitScreen Controls";

        var control = ctrlLayer.Effects.addProperty("ADBE Slider Control");
        control.name = "Screen Count";
				control.property("ADBE Slider Control-0001").setValue(n);

				control = ctrlLayer.Effects.addProperty("ADBE Slider Control");
        control.name = "Screen Offset";
				control.property("ADBE Slider Control-0001").setValue(0);

        control = ctrlLayer.Effects.addProperty("ADBE Checkbox Control");
        control.name = "Vertical?";

				var shapeLayer,shapeGroup,rect,lay, k;
				//Then we go layer by layer and create its alpha and position them
				for(i=0; i<n; i++){
					lay = effectsGroup[i];
					//We start by creating the alpha
					shapeLayer = curItem.layers.addShape();
					shapeLayer.name = lay.name + " - Alpha " + (i+1).toString();
					// add a Path group to our existing shape layer
					shapeGroup = shapeLayer.property("Contents").addProperty("ADBE Vector Group");
					rect = shapeGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
					rectSize = rect.property("ADBE Vector Rect Size")
					rectSize.setValue([curItem.width/n,curItem.height]);
					//Add expression so it gets linked to the controls
					rectSize.expression = "ctrlLayer = thisComp.layer(\"SplitScreen Controls\"); \nif(ctrlLayer === undefined){\n\t thisProperty \n} else {\n\t vert = ctrlLayer.effect(\"Vertical?\").param(1);\n\t num = ctrlLayer.effect(\"Screen Count\").param(1);\n\t (vert == 0)? [thisComp.width/num, thisComp.height]:[thisComp.width, thisComp.height/num]\n}";
					shapeGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");

					//Also we move it to the desired position
					shapeLayer.transform.position.setValue([(i+0.5)*curItem.width/n,curItem.height/2]);
					shapeLayer.transform.position.expression = "ctrlLayer = thisComp.layer(\"SplitScreen Controls\");\nif(ctrlLayer === undefined){\n  thisProperty\n} else {\n  vert = ctrlLayer.effect(\"Vertical?\").param(1);\n  num = ctrlLayer.effect(\"Screen Count\").param(1);\n\n  offs = ctrlLayer.effect(\"Screen Offset\").param(1);\n\n  n = 0;\n  layerHave = \"- Alpha\";\n  for(i=index+1;i<=thisComp.numLayers;i++){\n    if (thisComp.layer(i).name.includes(layerHave)) n++;\n  }\n\n  (vert == 0)? [(n-offs+0.5)*thisComp.width/num, thisComp.height/2]:[thisComp.width/2, (n-offs+0.5)*thisComp.height/num]\n}\n";
					shapeLayer.moveBefore(lay);
					lay.parent = shapeLayer;
					lay.transform.position.setValue([0,0]);
					lay.trackMatteType = TrackMatteType.ALPHA;
				}
      }
    }

    // close the undo group
    app.endUndoGroup();
  }

	myScript();
}
