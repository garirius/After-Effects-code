//HORIZONTAL TICKS
zpoint = effect("Point Control")("Point");
len = effect("Slider Control 9")("Slider");

thisProperty.createPath([zpoint,zpoint+[0,len]]);

//Repeater horizontal
  //Copies
  xlim = [effect("Slider Control")("Slider"),effect("Slider Control 2")("Slider")];
  upt = effect("Slider Control 10")("Slider");

  Math.floor(1+(xlim[1]-xlim[0])/upt);

  //Transform
  ppu = effect("Point Control 2")("Point")[0];
  upt = effect("Slider Control 10")("Slider");

  [ppu*upt,0]

  //Offset
  xlim = [effect("Slider Control")("Slider"),effect("Slider Control 2")("Slider")];
  num = content("Ticks Horizontal").content("Repeater 1").copies;
  upt = effect("Slider Control 10")("Slider");

  if(xlim[0]>=0){
    0
  } else if(xlim[1]<=0){
    -num+1
  } else {
    -Math.floor(-xlim[0]/upt)
  }

//VERTICAL TICKS
zpoint = effect("Point Control")("Point");
len = effect("Slider Control 9")("Slider");

thisProperty.createPath([zpoint,zpoint-[len,0]]);

//Repeater vertical
  //Copies
  ylim = [effect("Slider Control 7")("Slider"),effect("Slider Control 8")("Slider")];
  upt = effect("Slider Control 10")("Slider");

  Math.floor(1+(ylim[1]-ylim[0])/upt);

  //Transform
  ppu = effect("Point Control 2")("Point")[1];
  upt = effect("Slider Control 10")("Slider");

  [0,-ppu*upt]

  //Offset
  ylim = [effect("Slider Control 7")("Slider"),effect("Slider Control 8")("Slider")];
  num = content("Ticks Vertical").content("Repeater 1").copies;
  upt = effect("Slider Control 10")("Slider");

  if(ylim[0]>=0){
    0
  } else if(ylim[1]<=0){
    -num+1
  } else {
    -Math.floor(-ylim[0]/upt)
  }
