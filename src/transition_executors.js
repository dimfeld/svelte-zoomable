import { transition_in } from 'svelte/internal';

function ramp(start, end, cb) {
  return (t, u) => {
    if (t <= start) {
      t = 0;
    } else if (t >= end) {
      t = 1;
    } else {
      t = (t - start) / (end - start);
    }

    return cb(t, 1 - t);
  };
}

/** Simple opacity fade for zooming overview screen  */
export function fade({ node, start, end }) {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  return {
    css: ramp(start, end, (t, u) => `opacity: ${t * opacity}`),
  };
}

export function none() {
  return {
    css: () => '',
  };
}

/** detail transition appears to expand or contract between overview node and full area of zoomable container.
 * I'm still experimenting with getting this to look good.
 */
export function zoomClipRect({ otherRect: from, node, start, end }) {
  let to = node.getBoundingClientRect();

  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const originalTransform = style.transform === 'none' ? '' : style.transform;

  let topStart = from.top - to.top;
  let topEnd = 0;
  let dTop = topEnd - topStart;

  let bottomStart = topStart + from.height;
  let bottomEnd = to.height;
  let dBottom = bottomEnd - bottomStart;

  let leftStart = from.left - to.left;
  let leftEnd = 0;
  let dLeft = leftEnd - leftStart;

  let rightStart = leftStart + from.width;
  let rightEnd = to.width;
  let dRight = rightEnd - rightStart;

  return {
    css: ramp(start, end, (t, u) => {
      let opacityStyle = `opacity: ${t * opacity}`;

      let top = topStart + t * dTop + 'px';
      let bottom = bottomStart + t * dBottom + 'px';
      let left = leftStart + t * dLeft + 'px';
      let right = rightStart + t * dRight + 'px';

      let clipRect = `clip-path: polygon(0px 0px, ${right} 0px, ${right} ${bottom}, 0px ${bottom})`;
      let transform = `transform: ${originalTransform} translate(${left} ${top})`;

      let result = [
        opacityStyle,
        clipRect,
        transform,
        // 'background-color: hsla(0, 0%, 95%)',
      ]
        .filter(Boolean)
        .join(';');
      // console.log(t, result);
      return result;
    }),
  };
}

/** This is the guts of Svelte's crossfade transition extracted
 * out and modified slightly to work with the rest of these
 * transition runners.
 */
export function crossfade({ otherRect, activeOverviewRect, node, start, end }) {
  const from = otherRect || activeOverviewRect;
  const to = node.getBoundingClientRect();
  const dx = from.left - to.left;
  const dy = from.top - to.top;
  const dw = from.width / to.width;
  const dh = from.height / to.height;
  const d = Math.sqrt(dx * dx + dy * dy);

  const style = getComputedStyle(node);
  const transform = style.transform === 'none' ? '' : style.transform;
  const opacity = +style.opacity;

  return {
    css: ramp(
      start,
      end,
      (t, u) => `
      opacity: ${t * opacity};
      transform-origin: top left;
      transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${
        t + (1 - t) * dw
      }, ${t + (1 - t) * dh});
    `
    ),
  };
}

/** The siblings overview nodes all move away from the expanding detail node */
export function flyAwayFrom({
  detailRect: fromDetail,
  activeOverviewRect: fromOverview,
  node,
  start,
  end,
}) {
  let current = node.getBoundingClientRect();

  let distanceY =
    current.top <= fromOverview.top
      ? fromDetail.top - fromOverview.top
      : fromDetail.bottom - fromOverview.bottom;
  let distanceX =
    current.left <= fromOverview.left
      ? fromDetail.left - fromOverview.left
      : fromDetail.right - fromOverview.right;

  // console.log({ distanceX, distanceY });

  const style = getComputedStyle(node);
  const opacity = +style.opacity;

  const basePosition = `position:absolute;top:${current.top}px;left:${current.left}px`;

  return {
    css: ramp(start, end, (t, u) => {
      let x = distanceX * u;
      let y = distanceY * u;
      let opacityStyle = `opacity: ${t * opacity}`;
      let result = [
        basePosition,
        `transform: translate(${x}px, ${y}px)`,
        opacityStyle,
      ].join(';');
      // console.log(result);
      return result;
    }),
  };
}

/** Fly into the selected overview */
export function flyIntoSelected({
  activeOverviewRect: toOverview,
  node,
  start,
  end,
}) {
  const current = node.getBoundingClientRect();
  const style = getComputedStyle(node);
  const opacity = +style.opacity;

  let currentCenterX = (current.right + current.left) / 2;
  let currentCenterY = (current.top + current.bottom) / 2;

  let destCenterX = (toOverview.right + toOverview.left) / 2;
  let destCenterY = (toOverview.top + toOverview.bottom) / 2;

  let distanceX = destCenterX - currentCenterX;
  let distanceY = destCenterY - currentCenterY;

  return {
    css: ramp(start, end, (t, u) => {
      let x = distanceX * u;
      let y = distanceY * u;

      let opacityStyle = `opacity: ${t * opacity}`;
      let result = [opacityStyle, `transform: translate(${x}px, ${y}px)`].join(
        ';'
      );

      return result;
    }),
  };
}
