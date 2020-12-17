/*
Overview content fades in/out in place
detail content does the crossfade style change?
*/

export function overview(_from, _node) {
  return {
    css: (t, u) => `opacity: ${t}`,
  };
}

function none() {
  return {
    css: () => '',
  };
}

export function detail(from, node) {
  let to = node.getBoundingClientRect();

  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const transform = style.transform === 'none' ? '' : style.transform;

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

      let clipRect = `clip-path: polygon(${left} ${top}, ${right} ${top}, ${right} ${bottom}, ${left} ${bottom})`;

      let result = [
        // opacityStyle,
        clipRect,
        'background-color: hsla(0, 0%, 95%)',
      ]
        .filter(Boolean)
        .join(';');
      console.log(t, result);
      return result;
    },
  };
}

export function zoomTransition({ delay, duration, easing } = {}) {
  delay = delay ?? 0;
  duration = duration ?? 400;

  let sending = new Map();
  let receiving = new Map();

  function transition(items, counterparts) {
    return (node, params) => {
      items.set(params.key, node.getBoundingClientRect());

      return () => {
        let rect = counterparts.get(params.key);
        counterparts.delete(params.key);
        let style = rect ? params.style(rect, node) : none();

        if (!rect) {
          // No other element to fade with.
          items.delete(params.key);
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

  return [
    transition(sending, receiving, true),
    transition(receiving, sending, false),
  ];
}
