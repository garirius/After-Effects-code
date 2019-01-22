{
  //ME Initial Screen Builder.jsx 1.0
  // by Arcadi Garcia

  //CONSTANTS!
  var SOMEONE_ELSE_STRING = 'Someone else...', NULL_SIZE = [0,0], MAX_SIZE = [1000,1000],
    SECTION_NAME = 'MinuteEarthTools', STICK_FOLDER = 'StickFigureFolder';
  var PEOPLE = ['Alex', 'Arcadi', 'David', 'Emily', 'Ever', 'Henry', 'Jesse', 'Kate', 'Melissa', 'Nathaniel', 'Peter', 'Qingyang'], PEOPLE_COLUMNS = 3;
  var PEOPLE_PER_COLUMN = Math.floor(PEOPLE.length/PEOPLE_COLUMNS);

  function myScript(thisObj){
    function buildUI(thisObj){
      //GLOBAL VARIABLES
      var narratorName, narratorPath  = [null, null];

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
          narratorPath = getNarratorFiles();
          //if this was the first time we clicked on 'Someone else...' add a browse menu control
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
        gr.add("checkbox", undefined, PEOPLE[n], {name: PEOPLE[n], orientation: 'column'});
      }

      var everybodyBrowseControl = everybodyPanel.add("group",{x:0, y:0, height: 50, width: undefined});
      everybodyBrowseControl.add('statictext', undefined, 'File:');
      var everybodyBrowsePath = everybodyBrowseControl.add('edittext',undefined,'This Is Only A Default String!!!',{readonly:true, characters: 50});
      var everybodyBrowseButton = everybodyBrowseControl.add('button', undefined,'Browse...');

      /* ---------------- BUILD BUTTON --------------- */
      /*              Button for building!             */
      /* ----------------------------------------------*/
      var buildButton = panGroup.add("button",undefined,"Build!");
      buildButton.onClick = function(){
        str = "";
        for(var n=0; n<PEOPLE.length; n++){
          var gr = myPanel.findElement(PEOPLE[n]);
          str = str + PEOPLE[n] + ": " + (gr.value ? 'Yes':'No') + "\n";
        }
        alert(str);
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
