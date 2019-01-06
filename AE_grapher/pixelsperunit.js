size = effect(" AE Grapher Controls")("Graph Size");
xlim = effect(" AE Grapher Controls")("X Limits");
ylim = effect(" AE Grapher Controls")("Y Limits");

xlim = xlim[1] - xlim[0];
ylim = ylim[1] - ylim[0];

[size[0]/xlim, size[1]/ylim]
