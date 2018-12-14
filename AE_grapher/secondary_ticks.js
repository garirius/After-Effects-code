//VERTICAL
//Path
zpoint = effect("Point Control")("Point");
len = effect("Slider Control 14")("Slider");

thisProperty.createPath([zpoint,zpoint-[len,0]]);

//Copies
ylim = [effect("Slider Control 7")("Slider"),effect("Slider Control 8")("Slider")];
upt = effect("Slider Control 10")("Slider")/effect("Slider Control 13")("Slider");

Math.floor(1+(ylim[1]-ylim[0])/upt);

//Offset
ylim = [effect("Slider Control 7")("Slider"),effect("Slider Control 8")("Slider")];
num = thisProperty.propertyGroup(1).copies;
upt = effect("Slider Control 10")("Slider")/effect("Slider Control 13")("Slider");

if(ylim[0]>=0){
    0
} else if(ylim[1]<=0){
    -num+1
} else {
    -Math.floor(-ylim[0]/upt)
}

//Transform
content("Ticks").content("Vertical").content("Repeat V").transform.position/effect("Slider Control 13")("Slider");


//HORIZONTAL
//Path
zpoint = effect("Point Control")("Point");
len = effect("Slider Control 14")("Slider");

thisProperty.createPath([zpoint,zpoint+[0,len]]);

//Copies
xlim = [effect("Slider Control")("Slider"),effect("Slider Control 2")("Slider")];
upt = effect("Slider Control 10")("Slider")/effect("Slider Control 12")("Slider");

Math.floor(1+(xlim[1]-xlim[0])/upt);

//Offset
xlim = [effect("Slider Control")("Slider"),effect("Slider Control 2")("Slider")];
num = thisProperty.propertyGroup(1).copies;
upt = effect("Slider Control 10")("Slider")/effect("Slider Control 12")("Slider");

if(xlim[0]>=0){
    0
} else if(xlim[1]<=0){
    -num+1
} else {
    -Math.floor(-xlim[0]/upt)
}

//Transform
content("Ticks").content("Horizontal").content("Repeater H").transform.position/effect("Slider Control 12")("Slider");
