/*
Overview content fades in/out in place
detail content does the crossfade style change?
*/

/** Simple opacity fade for zooming overview screen  */
export function overview(_from, node) {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  return {
    css: (t, u) => `opacity: ${t * opacity}`,
  };
}

function none() {
  return {
    css: () => '',
  };
}

/** detail transition appears to expand or contract between overview node and full area of zoomable container */
export function detail(from, node) {
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
    css: (t, u) => {
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
    },
  };
}

/** The siblings overview nodes all move away from the expanding detail node */
function flyAwayFrom(fromDetail, fromOverview, node) {
  let current = node.getBoundingClientRect();

  let distanceY =
    current.top <= fromOverview.top
      ? fromDetail.top - fromOverview.top
      : fromDetail.bottom - fromOverview.bottom;
  let distanceX =
    current.left <= fromOverview.left
      ? fromDetail.left - fromOverview.left
      : fromDetail.right - fromOverview.right;

  console.log({ distanceX, distanceY });

  const style = getComputedStyle(node);
  const opacity = +style.opacity;

  const basePosition = `position:absolute;top:${current.top}px;left:${current.left}px`;

  return {
    css: (t, u) => {
      let x = distanceX * u;
      let y = distanceY * u;
      let opacityStyle = `opacity: ${t * opacity}`;
      let result = [
        basePosition,
        `transform: translate(${x}px, ${y}px)`,
        opacityStyle,
      ].join(';');
      console.log(result);
      return result;
    },
  };
}

export function zoomTransition({ delay, duration, easing } = {}) {
  delay = delay ?? 0;
  duration = duration ?? 400;

  let sending = new Map();
  let receiving = new Map();

  let siblingData = new Map();

  function transition(items, counterparts) {
    return (node, params) => {
      let rect = node.getBoundingClientRect();
      items.set(params.key, rect);

      if (params.parent !== undefined) {
        let d = siblingData.get(params.parent);
        if (!d) {
          d = {
            refCount: 0,
            overviews: new Map(),
            detail: null,
          };

          siblingData.set(params.parent, d);
        }

        // Since we don't know yet which node is actually zooming and which
        // are just the flying overviews, track them all.
        d.refCount++;
        if (params.isDetail) {
          console.log(
            `Registered detail ${params.key} for parent ${params.parent}`
          );
          d.detail = {
            id: params.key,
            rect,
          };
        } else {
          console.log(
            `Registered overview ${params.key} for parent ${params.parent}`
          );
          d.overviews.set(params.key, rect);
        }
      }

      return () => {
        console.log(`Transitioning ${params.key}`);
        let rect = counterparts.get(params.key);
        counterparts.delete(params.key);

        if (!rect) {
          // No other element to fade with.
          items.delete(params.key);
        }

        let style;
        if (params.parent !== undefined) {
          let d = siblingData.get(params.parent);
          if (d) {
            if (d.detail && !rect) {
              let detailRect = d.detail.rect;
              let zoomingOverviewRect = d.overviews.get(d.detail.id);
              console.log(`${params.key} is a sibling`, {
                detailRect,
                zoomingOverviewRect,
              });
              style = flyAwayFrom(detailRect, zoomingOverviewRect, node);
            }

            d.refCount--;
            if (!d.refCount) {
              siblingData.delete(params.parent);
            }
          }
        }

        if (!style) {
          style = rect ? params.style(rect, node) : none();
        }

        return {
          delay,
          duration,
          easing,
          ...style,
        };
      };
    };
  }

  return [transition(sending, receiving), transition(receiving, sending)];
}

export const [send, receive] = zoomTransition({
  duration: 200,
});
