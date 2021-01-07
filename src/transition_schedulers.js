/** All elements transition at the same time */
export function allTogether({delay, duration, siblingData, id}) {
  return {
    delay,
    duration,
  };
}

/** Each "other" overview element runs its transition, one at a
 * time, and then the active overview and the detail run at the end.
 */
export function otherOverviewsSeriesFirst({delay, duration, siblingData, id}) {

  let numElements = siblingData.overviews.size;
  let thisDuration = duration / numElements;
  let detailId = siblingData.detail?.id;
  let detailIncoming = siblingData.detail?.incoming;

  if(id === detailId) {
    // This is a detail so it goes last (or first if outgoing).
    if(detailIncoming) {
      delay += (thisDuration * (numElements - 1));
    }

    return {
      delay,
      duration: thisDuration,
    };
  }

  // See where this one came in the insertion order.
  let thisIndex = 0;
  for(let s of siblingData.overviews.keys()) {
    if(s === id) {
      break;
    }

    if(s !== detailId) {
      thisIndex++;
    }
  }

  let elementSequence = thisDuration * thisIndex;
  if(detailIncoming) {
    delay += elementSequence;
  } else {
    delay += (duration - elementSequence);
  }

  return {
    delay,
    duration: thisDuration,
  }


}

/** The "other" overview elements runs their transitions simultaneously, and then the active overview and the detail run at the end.
 */
export function otherOverviewsParallelFirst({delay, duration, siblingData, id}) {
  let detailId = siblingData.detail?.id;
  let detailIncoming = siblingData.detail?.incoming;

  let thisDuration = duration / 2;

  let thisIsLast = id === detailId && detailIncoming;

  return {
    duration: thisDuration,
    delay: delay + (thisIsLast ? thisDuration : 0),
  };
}
