size = effect(" AE Grapher Controls")("Graph Size");
xlim = effect(" AE Grapher Controls")("X Limits");
ylim = effect(" AE Grapher Controls")("Y Limits");

[clamp(linear(0,xlim[0],xlim[1],0,1)-0.5,-1/2,1/2)*size[0],clamp(-linear(0,ylim[0],ylim[1],0,1)+0.5,-1/2,1/2)*size[1]]
