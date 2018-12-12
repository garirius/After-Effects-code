//First we have to see where we are in time
//We start by looking for the latest keyframe
kf = thisProperty.nearestKey(time);

if(time >= kf.time){
  kf = kf.index;
} else {
  kf = kf.index - 1;
}
//kf = index of the last keyframe before actual time
//Now let's work on the case by case scenario
total = thisProperty.numKeys; //total number of keyframes

if(kf < 1){ //if the first keyframe hasn't even happened, we have no animation
  thisProperty.key(1).value;
} else if(kf >= total){ //same thing if we're past the last keyframe
  thisProperty.key(total).value;
} else { //otherwise, we can get down to the interpolation
  start = thisProperty.key(kf); //starting keyframe
  target = thisProperty.key(kf+1); //target keyframe
  duration = target.time - start.time;

  /* Scale doesn't NEED to be uniform, sooo we're gonna apply this interpolation
  independently in every dimension*/
  zoom = [100,100];
  for(n=0; n<2; n++){
    zoom[n] = start.value[n]*Math.pow(target.value[n]/start.value[n],(time - start.time)/duration);
  }

  zoom
}
