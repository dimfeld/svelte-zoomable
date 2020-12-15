export function createZoomManager() {
  let currentZoomPath = [];
  let currentZoomPathStore = writable(currentZoomPath);
  let components = new Map();

  return {
    ...currentZoomPathStore,
    zoomed(zoomPath) {
      if(zoomPath.split('.').every((p, i) => currentZoomPath[i] === p)) {
        return true;
      }
    },
    set(zoomPathString) {
      let zoomPath = zoomPathString.split('.');
      let commonSegments = 0;
      while(commonSegments < zoomPath.length && commonSegments < currentZoomPath.length && zoomPath[commonSegments] === currentZoomPath[commonSegments]) {
        commonSegments++;
      }

      // Unzoom everything in currentZoomPath that doesn't match the new path.
      for(let i = currentZoomPath.length - 1; i > commonSegments; --i) {
        let componentPath = currentZoomPath.slice(0, i + 1).join('.');
        let componentData = components.get(componentPath);
        if(componentData) {
          componentData.callback(false);
        }
      }

      currentZoomPathStore.set(zoomPath);

      for(let i = commonSegments + 1; i < zoomPath.length; ++i) {
        let componentPath = zoomPath.slice(0, i);
        let componentData = components.get(componentPath);
        if(componentData) {
          componentData.callback(true);
        }
      }

    }
  }
}
