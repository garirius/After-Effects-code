size = [effect("Slider Control 5")("Slider"),effect("Slider Control 6")("Slider")];
xlim = [effect("Slider Control")("Slider"),effect("Slider Control 2")("Slider")];
ylim = [effect("Slider Control 7")("Slider"),effect("Slider Control 8")("Slider")];

[clamp(linear(0,xlim[0],xlim[1],0,1)-0.5,-1/2,1/2)*size[0],clamp(-linear(0,ylim[0],ylim[1],0,1)+0.5,-1/2,1/2)*size[1];]
