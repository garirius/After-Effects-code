{
  //ME Initial Screen Builder.jsx 1.0
  // by Arcadi Garcia

  //CONSTANTS!
  var SOMEONE_ELSE_STRING = 'Someone else...', NULL_SIZE = [0,0], MAX_SIZE = [1000,1000],
    SECTION_NAME = 'MinuteEarthTools', STICK_FOLDER = 'StickFigureFolder';
  var PEOPLE = ['Alex', 'Arcadi', 'David', 'Emily', 'Ever', 'Henry', 'Jesse', 'Kate', 'Melissa', 'Nathaniel', 'Peter', 'Qingyang'], PEOPLE_COLUMNS = 3;
  var PEOPLE_PER_COLUMN = Math.floor(PEOPLE.length/PEOPLE_COLUMNS);
  var PNG_SIZE = [1200, 1200], DEF_SCALE = [35,35], DEF_POS = [960,334], DEF_INIT_POS = [960,673], TRANSITION_TIMES = [1.167,1.467], ANCHOR = [505.8,592];
  var BG_SCALE = [285.7,285.7], BG_POS = [622.9,1188.6], BG_ID = 119;
  var EASE_START = new KeyframeEase(0,33.33), EASE_END = new KeyframeEase(0,72.92);

  function myScript(thisObj){
    function buildUI(thisObj){
      //GLOBAL VARIABLES
      var narratorName=null, narratorPath  = [null, null];
      var morePeople = null;

      /**
       * Toggles visibility of a certain Control object in ScriptUI
       * @param {Control} what Control object whose visibility needs to be toggled
       */
      function toggleVisibility(what){
        what.maximumSize = (what.visible) ? NULL_SIZE:MAX_SIZE;
        what.visible = !what.visible;
        what.window.layout.layout(true);
      }

      /**
       * Filters files that include a certain string.
       * @param {String} str String that must be included
       * @returns {String|Function|Null} File filter for the openDlg() function. String if we're on Windows. Function if we're on Mac. Null if something else????
       */
      function fileFilter(str){
        switch(File.fs){
          case 'Windows':
            return str;
            break;
          case 'Macintosh':
            return function(fil){
              var pattern = str.split("*");
              for(var n=0; n<pattern.length; n++){
                if(fil.name.indexOf(pattern[n]) < 0) return false;
              }
              return true;
            };
            break;
          default:
            return null
        }
      }

      /**
       * Asks for the files for the narrator.
       * @returns {File[],Null[]} Files for the body and the arm.
       */
      function getNarratorFiles(){
        var fil = app.project.file, narPa = [null, null];
        //ask for the files that will be needed: body and arm
        alert('Select a file for the body');
        narPa[0] = fil.openDlg('Narrator Body File Selection');
        if(narPa[0] !== null){
          alert('Select a file for the arm');
          narPa[1] = narPa[0].openDlg('Narrator Arm File Selection', fileFilter('*.png'));

          if(narPa[1] !== null){
            narratorBrowsePath.text = narPa[0].displayName;
            narratorName = narPa[0].displayName;
            return narPa;
          } else return [null, null];
        } else return [null, null];
      }

      var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "MinuteEarth Initial Screen Builder", undefined, {resizeable: true, closeButton: true});
      myPanel.onResize = myPanel.layout.layout(true);

      //Build UI itself
      myPanel.grp = myPanel.add("group {orientation: 'column', alignChildren: 'fill'}");
      var panGroup = myPanel.grp;
      defSize = [30,30];

      /* ------------ NARRATOR PANEL ----------------- */
      /*       Selects who is going to narrate.        */
      /* ----------------------------------------------*/
      var narratorPanel = panGroup.add("panel",undefined, "Who's going to narrate?", {name: 'narrator', orientation: 'column'});
      var narrator = narratorPanel.add("dropdownlist", undefined, ['Kate', 'David', 'Alex', SOMEONE_ELSE_STRING]);
      narrator.selection = 0;
      narratorName = 'Kate';
      var narratorBrowseControl = narratorPanel.add("group",{x:0, y:0, height: 50, width: undefined});
      narratorBrowseControl.add('statictext', undefined, 'File:');
      var narratorBrowsePath = narratorBrowseControl.add('edittext',undefined,'This Is Only A Default String!!!',{readonly:true, characters: 50});
      var narratorBrowseButton = narratorBrowseControl.add('button', undefined,'Browse...');
      narratorBrowseControl.visible = false;
      narratorBrowseControl.maximumSize = NULL_SIZE;

      //Define behaviour of script according to the narrator selected
      narrator.onChange = function(){
        //if the option selected was "someone else" open dialog to look for the file
        if(this.selection == this.items[this.items.length - 1]){
          //if this is the first time we clicked on it, ask for files
          if(narratorPath[0] === null) narratorPath = getNarratorFiles();
          //add a browse menu control
          if(!narratorBrowseControl.visible) toggleVisibility(narratorBrowseControl);
        } else {
          narratorName = this.selection;
          if(narratorBrowseControl.visible) toggleVisibility(narratorBrowseControl);
        }
      }
      narratorBrowseButton.onClick = function(){
        narratorPath = getNarratorFiles();
      }

      /* --------------- EVERYBODY ELSE -------------- */
      /*          Selects who else is appearing.       */
      /* ----------------------------------------------*/
      var everybodyPanel = panGroup.add("panel", undefined, "Who else is appearing?",{orientation: 'column'});
      var everybodyGroup = everybodyPanel.add("group", undefined, {orientation: 'column'});
      for(var n=0; n<PEOPLE_COLUMNS; n++){
        var sa = everybodyGroup.add("group");
        sa.orientation = 'column';
        sa.alignChildren = 'left';
      }

      for(var n=0; n<PEOPLE.length; n++){
        var gr = everybodyGroup.children[Math.floor(n/PEOPLE_PER_COLUMN)];
        var ch = gr.add("checkbox", undefined, PEOPLE[n], {name: PEOPLE[n], orientation: 'column'});
        switch (PEOPLE[n]) {
          case 'Nathaniel':
          case 'Melissa':
          case 'Henry':
          case 'Peter':
          case 'Alex':
            ch.value = true;
            break;
          default:
            ch.value = false;
        }
      }

      var everybodyBrowseControl = everybodyPanel.add("group",{x:0, y:0, height: 50, width: undefined});
      everybodyBrowseControl.add('statictext', undefined, 'File:');
      var everybodyBrowsePath = everybodyBrowseControl.add('edittext',undefined,'This Is Only A Default String!!!',{readonly:true, characters: 50});
      var everybodyBrowseButton = everybodyBrowseControl.add('button', undefined,'Browse...');

      everybodyBrowseButton.onClick = function(){
        var fil = app.project.file;
        //ask for the files that will be needed: body and arm
        alert('Select files for everyone you want to add ');
        morePeople = fil.openDlg('Team Member File Selection', fileFilter('*(T)*.png'), true);
        if(morePeople !== null){
          if(morePeople instanceof Array){
            var str = "";
            for(var n=0; n<morePeople.length-1; n++) str = str + morePeople[n].displayName + ",";
            everybodyBrowsePath.text = str + morePeople[morePeople.length-1].displayName;
          } else everybodyBrowsePath.text = morePeople.displayName;
        }
      }

      /* ---------------- BUILD BUTTON --------------- */
      /*              Button for building!             */
      /* ----------------------------------------------*/
      var buildButton = panGroup.add("button",undefined,"Build!");
      buildButton.onClick = function(){
        var comp;

        app.beginUndoGroup('Build ME Initial Screen');
        //First we'll see who's narrating
        var fol;
        var cond = (narratorPath[0] === null) ? false:(narratorName === narratorPath[0].displayName);
        if(cond){ //if we have chosen a different person, create a whole new Comp
          narratorName = narratorPath[0].displayName.split(" ")[0];
          //make sure we have all the files necessary
          if(narratorPath[0] !== null && narratorPath[1] !== null){
            fol = app.project.items.addFolder(narratorName);
            //create a new comp starring our new narrator
            comp = app.project.items.addComp(narratorName+' Intro', 1920, 1080, 1, 4, 24);
            //set motion blur options
            comp.motionBlur = true;
            comp.shutterAngle = 90;
            comp.shutterPhase = -45;

            //import narrator files
            //body
            var body = new ImportOptions(narratorPath[0]);
            body.importAs = ImportAsType.FOOTAGE;
            body = app.project.importFile(body);
            body.parentFolder = fol;
            //arm
            var arm = new ImportOptions(narratorPath[1]);
            arm.importAs = ImportAsType.FOOTAGE;
            arm = app.project.importFile(arm);
            arm.parentFolder = fol;

            //place elements inside comp
            body = comp.layers.add(body);
            body.name = narratorName + ' Body';
            body.motionBlur = true;
            body.position.setValue(DEF_POS);
            body.scale.setValue([DEF_SCALE[0]*PNG_SIZE[0]/body.width, DEF_SCALE[1]*PNG_SIZE[1]/body.height]);

            arm = comp.layers.add(arm);
            arm.name = narratorName + ' Arm';
            arm.motionBlur = true;
            arm.position.setValue(DEF_POS);
            arm.scale.setValue([DEF_SCALE[0]*PNG_SIZE[0]/arm.width, DEF_SCALE[1]*PNG_SIZE[1]/arm.height]);
            //waving animation
            arm.rotation.expression = '21*Math.pow(Math.sin(Math.PI*timeToFrames(time)/16),2)';

            //anchorpoint linking so it's easier to adjust later
            arm.anchorPoint = ANCHOR; arm.parent = body;

            //add the zooming animation
            body.position.setValuesAtTimes(TRANSITION_TIMES,[DEF_INIT_POS,DEF_POS]);
            body.scale.setValuesAtTimes(TRANSITION_TIMES,[[100*PNG_SIZE[0]/body.width, 100*PNG_SIZE[1]/body.height],[DEF_SCALE[0]*PNG_SIZE[0]/body.width, DEF_SCALE[1]*PNG_SIZE[1]/body.height]]);

            //ease the zooming animation
            body.position.setTemporalEaseAtKey(1, [EASE_START]);
            body.position.setTemporalEaseAtKey(2, [EASE_END]);
            body.scale.setTemporalEaseAtKey(1, [EASE_START, EASE_START, EASE_START]);
            body.scale.setTemporalEaseAtKey(2, [EASE_END, EASE_END, EASE_END]);

            //add background
            var bg = comp.layers.add(app.project.itemByID(BG_ID));
            bg.parent = body; bg.motionBlur = true;
            bg.scale.setValue(BG_SCALE); bg.position.setValue(BG_POS);
            bg.moveToEnd();
          } else alert("Missing narrator files! Please try again and make sure to select of the files - the body and the arm.");
        } else { //if not, we can clone Kate/Alex/David's
          fol = app.project.items.addFolder(narratorName);
          var alles = app.project.rootFolder.items;
          for(var n=1; n<=alles.length; n++){
            if(alles[n] instanceof CompItem && alles[n].name.indexOf(narratorName) >= 0){
              comp = alles[n];
            }
          }
          comp = comp.duplicate();

          //remove unnecessary layers
          var lays = comp.layers;
          var n=1;
          while(n<=lays.length){
            if(lays[n].name.indexOf(narratorName+'.png') >= 0)
              lays[n].remove();
            else n++;
          }
        }

        //put composition inside folder and open
        comp.parentFolder = fol;
        app.endUndoGroup();
        comp.openInViewer();
        myPanel.close();
      }

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
