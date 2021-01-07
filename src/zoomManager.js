import { writable } from 'svelte/store';
export const zoomManagerContext = Symbol('zoom-manager');
export const zoomParentContext = Symbol('zoom-parent');
export const zoomTransitionContext = Symbol('zoom-transition');

function toArray(zoomPath) {
  if (typeof zoomPath === 'string') {
    zoomPath = zoomPath.split('.');
    if (zoomPath[0] === '') {
      zoomPath = [];
    }
  }

  return zoomPath;
}

export function createZoomManager() {
  let currentZoomPath = [];
  let currentZoomPathStore = writable({ path: currentZoomPath, title: [] });
  let components = new Map();

  const status = (zoomPath) => {
    zoomPath = toArray(zoomPath);
    let zoomed = zoomPath.every((p, i) => currentZoomPath[i] === p);
    let active = zoomPath.length == currentZoomPath.length;

    return {
      zoomed,
      active,
    };
  };

  const updateComponent = (pathArray, zoomed, active) => {
    let path = pathArray.join('.');
    let componentData = components.get(path);
    // console.log(`${path} zoomed ${zoomed} active ${active}`);
    componentData?.callback({ zoomed, active });
  };

  return {
    ...currentZoomPathStore,
    register({ id, title, callback }) {
      let idString = Array.isArray(id) ? id.join('.') : id;

      components.set(idString, { title, callback });
      callback(status(id));
      return () => components.delete(idString);
    },
    status,
    set(zoomPath) {
      zoomPath = toArray(zoomPath);

      // console.log(`Moving to ${zoomPath.join('.')}`);

      let commonSegments = 0;
      while (
        commonSegments < zoomPath.length &&
        commonSegments < currentZoomPath.length &&
        zoomPath[commonSegments] === currentZoomPath[commonSegments]
      ) {
        commonSegments++;
      }

      // Unzoom everything in currentZoomPath that doesn't match the new path.
      for (let i = currentZoomPath.length - 1; i >= commonSegments; --i) {
        updateComponent(currentZoomPath.slice(0, i + 1), false, false);
      }

      let finalComponentPath = zoomPath.join('.');
      let finalComponentData = components.get(finalComponentPath);
      currentZoomPath = [...zoomPath];
      currentZoomPathStore.set({
        path: currentZoomPath,
        title: [...(finalComponentData?.title || [])],
      });

      for (let i = commonSegments; i < zoomPath.length; ++i) {
        updateComponent(zoomPath.slice(0, i), true, false);
      }

      // Notify the newly-active component.
      if (finalComponentData) {
        finalComponentData.callback({ zoomed: true, active: true });
      }
    },
  };
}
