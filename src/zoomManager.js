import { writable } from 'svelte/store';
export const zoomManagerContext = Symbol('zoom-manager');
export const zoomParentContext = Symbol('zoom-parent');

function toArray(zoomPath) {
  if(typeof zoomPath === 'string') {
    zoomPath = zoomPath.split('.');
    if(zoomPath[0] === '') {
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
  }

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

      console.log(`Moving to ${zoomPath.join('.')}`);

      let commonSegments = 0;
      while(commonSegments < zoomPath.length && commonSegments < currentZoomPath.length && zoomPath[commonSegments] === currentZoomPath[commonSegments]) {
        commonSegments++;
      }

      // Unzoom everything in currentZoomPath that doesn't match the new path.
      for(let i = currentZoomPath.length - 1; i >= commonSegments; --i) {
        let componentPath = currentZoomPath.slice(0, i + 1).join('.');
        let componentData = components.get(componentPath);
        if(componentData) {
          componentData.callback({ zoomed: false, active: false });
        }
      }

      let finalComponentPath = zoomPath.join('.');
      let finalComponentData = components.get(finalComponentPath);
      currentZoomPath = [...zoomPath];
      currentZoomPathStore.set({
        path: currentZoomPath,
        title: [...(finalComponentData?.title || [])]
      });

      if(commonSegments < zoomPath.length) {

        for(let i = commonSegments; i< zoomPath.length - 1; ++i) {
          let componentPath = zoomPath.slice(0, i).join('.');
          let componentData = components.get(componentPath);
          if(componentData) {
            componentData.callback({ zoomed: true, active: i === zoomPath.length - 1});
          }
        }
      }

      // We moved up the zoom tree but not into anything else, so notify the newly-active component.
      if(finalComponentData) {
        finalComponentData.callback({ zoomed: true, active: true });
      }

    }
  }
}
