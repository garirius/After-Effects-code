//WRITE YOUR FUNCTION HERE
function plot(x){
  // Here's some pre-made parameters in case you need 'em!
  a = 5;
  b = 0;
  c = 2;

  return a*Math.exp(-x*x/(2*c*c));
}

//this function checks if the value is inside the graph range
function isInRange(y){
  if(y <= ylim[1] && y>=ylim[0])
    return true
  else
      return false
}

//function analysis
zpoint = effect("Point Control")("Point");
ppu = effect("Point Control 2")("Point");
ticks = content("Secondary Ticks").content("Horizontal").content("Repeater H").copies;
offset = content("Secondary Ticks").content("Horizontal").content("Repeater H").offset;
upt = effect("Slider Control 10")("Slider")/effect("Slider Control 12")("Slider");

pointsList = [];
intang = [];
outang = [];
for(n=0; n<ticks; n++){
  x = (offset+n)*upt;
  y = plot(x);

  if(y !== undefined && y !== null){
    pointsList.push(zpoint+[x*ppu[0],-y*ppu[1]]);

    //and now we try to get the tangents
    epsilon = upt/3;
    yplu = plot(x+epsilon);
    ymin = plot(x-epsilon);

    derplu = (yplu - y)/epsilon;
    dermin = (y - ymin)/-epsilon;

    intang.push([-epsilon*ppu[0], -dermin*epsilon*ppu[1]]);
    outang.push([epsilon*ppu[0], -derplu*epsilon*ppu[1]]);
  }
}

thisProperty.createPath(pointsList,intang,outang,false);
