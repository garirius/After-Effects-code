// Auto Export History as PNG.jsx 2.0
// By Henry Reich, edited by Arcadi Garcia
// Based on Auto Save PSD by Joonas Pääkkö
// https://github.com/joonaspaakko
// https://github.com/joonaspaakko/Photoshop-Auto-Save-PSD-script
// Requires installation of action “Auto Save PNG” that activates “save” command
/*

    <javascriptresource>
    <name>$$$/JavaScripts/AutoSavePNG/Menu=Auto Export History as PNG Sequence</name>
    <category>Auto Save</category>
    <enableinfo>true</enableinfo>
    <eventid>64feff0a-8271-436f-8c59-d2105497d902</eventid>
    </javascriptresource>

*/

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

try {
    // Get the currently active document.
    var doc         = app.activeDocument;

    // Find out of the file has an extension
    var noExtension = doc.name.indexOf('.') == -1;

    // No file extension = File has not been saved yet
    if ( noExtension ) {
        // An action is triggered to prompt save as dialog.
        // You'd think that this would be easy to do, but I
        // couldn't figure out a better way for doing this.
        app.doAction('save','Auto Save PSD');
    }
    // Extension exists = File has been saved at least once
    else {
        doc.save(); // Save the original file.
    }
    var historyLength = doc.historyStates.length;

    for (var i = 2; i<historyLength-1; i++){ //hi! Arcadi here! I just changed this line
      doc.activeHistoryState = doc.historyStates[i];
      AutoSavePNG( doc );
    }
    doc.activeHistoryState = doc.historyStates[historyLength-1];
    app.beep();
} // try end

catch( e ) {
    // remove comments below to see error for debugging
     alert( e );
}

function AutoSavePNG( doc, docName ) {
    // Turn of layers named 'invisible'
    toggleLayer()

    // Extension
    var png                   = '.png';
    // Document name
    var docName               = doc.name;
    // Document path
    var docPath               = doc.path;
    // Gets rid of the extension
    var docName               = docName.substring( 0, docName.indexOf('.') );
    // Options for the soon to be exported
    var png_Opt               = new PNGSaveOptions();
    png_Opt.compression       = 4;    // High compression
    png_Opt.interlaced        = false; // Interlaced

    // Construct the Auto Save folder path
    var autoSavePath          = docPath + '/' + docName + ' drawing';

    // If Auto Save folder doesn't exist, make one.
    var autoSaveFolder        = new Folder( autoSavePath );
    if( !autoSaveFolder.exists ) { autoSaveFolder.create(); }

    // Get list of all the current auto saved files
    // Lists only those files .png that share the same file
    var currentAS             = autoSaveFolder.getFiles( docName + ' frame ' + '*' + png );

    // Get the number of those files and add one to it
    var suffix                = currentAS.length + 1001;

    // Save active document in the Auto Save folder
    doc.saveAs( File( autoSavePath + '/' + docName + ' frame ' + suffix + png ), png_Opt, true );
} // AutoSavePNG() end


// Turn off layers named 'invisible'
    function toggleLayer() {
  for( var i = 0; i < app.activeDocument.artLayers.length; i++) {
    if (app.activeDocument.artLayers[i].name == "invisible"){
     //   app.activeDocument.artLayers[i].allLocked = false;
        app.activeDocument.artLayers[i].visible = false;
    }
  }
}
