/** All elements transition at the same time */
export function allTogether({ siblingData, id }) {
  return {
    start: 0,
    end: 1,
  };
}

/** Each "other" overview element runs its transition, one at a
 * time, and then the active overview and the detail run at the end.
 */
export function otherOverviewsSeriesFirst({ siblingData, id, isDetail }) {
  let numElements = siblingData.overviews.size;
  let thisDuration = 1 / numElements;
  let detailId = siblingData.detail?.id;
  let detailIncoming = siblingData.detail?.incoming;

  if (id === detailId) {
    // This is a detail or the overview swapping with a detail.
    let start = isDetail ? 1 - thisDuration : 0;

    console.log({ id, start, thisDuration, detailId, isDetail });
    return {
      start,
      end: start + thisDuration,
    };
  }

  // See where this one came in the order.
  let thisIndex = 0;
  for (let s of Array.from(siblingData.overviews.keys()).sort()) {
    if (s === id) {
      break;
    }

    if (s !== detailId) {
      thisIndex++;
    }
  }

  let elementSequence = thisDuration * (thisIndex + 1);
  let start = elementSequence;

  console.log({ id, start, thisDuration, thisIndex, detailId });

  return {
    start,
    end: start + thisDuration,
  };
}

/** The "other" overview elements runs their transitions simultaneously, and then the active overview and the detail run at the end.
 */
export function otherOverviewsParallelFirst({ siblingData, id, isDetail }) {
  let detailId = siblingData.detail?.id;
  let start = isDetail || id !== detailId ? 0.5 : 0;

  console.log({ id, isDetail, start });

  return {
    start,
    end: start + 0.5,
  };
}
