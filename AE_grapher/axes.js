//VERTICAL
overshoot = effect(" AE Grapher Controls")("Y Overshoot");
size = effect(" AE Grapher Controls")("Graph Size");

xpos = effect(" AE Grapher Controls")("zPoint")[0];

thisProperty.createPath([[xpos,-size[1]/2 - overshoot],[xpos,size[1]/2 + overshoot]]);

//HORIZONTAL
overshoot = effect(" AE Grapher Controls")("X Overshoot");
size = effect(" AE Grapher Controls")("Graph Size");

ypos = effect(" AE Grapher Controls")("zPoint")[1];

thisProperty.createPath([[-size[0]/2 - overshoot,ypos],[size[0]/2 + overshoot,ypos]]);
