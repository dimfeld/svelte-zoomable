import * as transitions from './transition_executors';
import * as schedules from './transition_schedulers';

/** Presets for how the transitions work */
export const presets = {
  /** The selected detail expands outward while the other
   * overviews fly away from it.
   * This is still being tweaked and doesn't look too great yet. */
  zoomExperimental: {
    selectedOverview: transitions.fade,
    detail: transitions.zoomClipRect,
    otherOverviews: transitions.flyAwayFrom,
    schedule: schedules.allTogether,
    defaultDuration: 400,
  },
  /** Simple fade */
  fade: {
    detail: transitions.fade,
    selectedOverview: transitions.fade,
    otherOverviews: transitions.fade,
    schedule: schedules.allTogether,
    defaultDuration: 200,
  },
  crossfade: {
    detail: transitions.crossfade,
    selectedOverview: transitions.crossfade,
    otherOverviews: transitions.fade,
    schedule: schedules.allTogether,
    defaultDuration: 200,
  }
}


export function zoomTransition({ delay, duration, easing } = {}) {
  delay = delay ?? 0;
  duration = duration ?? preset.defaultDuration;

  let sending = new Map();
  let receiving = new Map();

  let siblingData = new Map();

  function transition(items, counterparts) {
    let isIncoming = items === receiving;

    return (node, params) => {
      let preset = params.preset ?? presets.fade;
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
            incoming: isIncoming,
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

              let executorParams = {
                detailRect,
                activeOverviewRect: zoomingOverviewRect,
                otherRect: null,
                node,
              };

              style = preset.otherOverviews(executorParams);
            }

            d.refCount--;
            if (!d.refCount) {
              siblingData.delete(params.parent);
            }
          }
        }

        if (!style) {
          if(rect) {
            let nodeRect = node.getBoundingClientRect();
            let executorParams = {
              detailRect: params.isDetail ? nodeRect : rect,
              activeOverviewRect: params.isDetail ? rect : nodeRect,
              otherRect: rect,
              node,
            };
            // This is one of the "active" elements
            style = params.isDetail ?
              preset.detail(executorParams) :
              preset.selectedOverview(executorParams);
          } else {
            // There is no other element, so just do nothing.
            style = none();
          }
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
