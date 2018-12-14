//VERTICAL
overshoot = effect("Slider Control 3")("Slider");
size = [effect("Slider Control 5")("Slider"),effect("Slider Control 6")("Slider")];

xpos = effect("Point Control")("Point")[0];

thisProperty.createPath([[xpos,-size[1]/2 - overshoot],[xpos,size[1]/2 + overshoot]]);

//HORIZONTAL
overshoot = effect("Slider Control 4")("Slider");
size = [effect("Slider Control 5")("Slider"),effect("Slider Control 6")("Slider")];

ypos = effect("Point Control")("Point")[1]

thisProperty.createPath([[-size[0]/2 - overshoot,ypos],[size[0]/2 + overshoot,ypos]]);
