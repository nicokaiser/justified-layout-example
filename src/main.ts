import {
  init,
  JustifiedLayout as JustifiedLayoutWasm,
} from "@immich/justified-layout-wasm";
import { JustifiedLayout as JustifiedLayoutJs } from "./justified-layout";
import justifiedLayout from "justified-layout";

let rowHeight = 235; // viewport.with < 850 => 100
const spacing = 2;
const heightTolerance = 0.15;

const aspectRatios = [
  1.5, 0.6666666666666666, 1.3274336283185841, 1.3333333333333333,
  0.7516666666666667, 1.5, 0.665, 1.4018691588785046, 1.3392857142857142,
];

const app = document.getElementById("app");

const container = document.createElement("div");
app?.appendChild(container);

// justified-layout
const headerFlickr = document.createElement("h3");
headerFlickr.innerHTML = "justified-layout";
container.appendChild(headerFlickr);
const galleryFlickr = document.createElement("div");
galleryFlickr.style.background = "lightgrey";
galleryFlickr.style.position = "relative";
galleryFlickr.style.marginBottom = "10px";
for (let i = 0; i < aspectRatios.length; i++) {
  const item = document.createElement("div");
  item.style.background = "grey";
  galleryFlickr.appendChild(item);
}
const galleryFlickrItems = galleryFlickr.querySelectorAll("div");
container.appendChild(galleryFlickr);

// @immich/justified-layout-wasm
await init();
const headerImmich = document.createElement("h3");
headerImmich.innerHTML = "@immich/justified-layout-wasm";
container.appendChild(headerImmich);
const galleryImmich = document.createElement("div");
galleryImmich.style.background = "lightgrey";
galleryImmich.style.position = "relative";
galleryImmich.style.marginBottom = "10px";
for (let i = 0; i < aspectRatios.length; i++) {
  const item = document.createElement("div");
  item.style.background = "grey";
  galleryImmich.appendChild(item);
}
const galleryImmichItems = galleryImmich.querySelectorAll("div");
container.appendChild(galleryImmich);

// updated JS implementation
const headerNew = document.createElement("h3");
headerNew.innerHTML = "justified-layout-js";
container.appendChild(headerNew);
const galleryNew = document.createElement("div");
galleryNew.style.background = "lightgrey";
galleryNew.style.position = "relative";
for (let i = 0; i < aspectRatios.length; i++) {
  const item = document.createElement("div");
  item.style.background = "grey";
  galleryNew.appendChild(item);
}
const galleryNewItems = galleryNew.querySelectorAll("div");
container.appendChild(galleryNew);

const info = document.createElement("p");
info.id = "info";
container.appendChild(info);

let containerWidth = 0;

function updateGallery() {
  if (!app) return;
  if (containerWidth === container.getBoundingClientRect().width) return;
  containerWidth = container.getBoundingClientRect().width;

  rowHeight = containerWidth < 850 ? 100 : 235;
  info.innerHTML = `spacing: ${spacing}<br>rowHeight: ${rowHeight} ± ${heightTolerance} (${rowHeight - rowHeight * heightTolerance}..${rowHeight + rowHeight * heightTolerance})`;

  // justified-layout
  const layoutFlickr = justifiedLayout(aspectRatios, {
    targetRowHeight: rowHeight,
    containerWidth,
    boxSpacing: spacing,
    targetRowHeightTolerance: heightTolerance,
    containerPadding: 0,
  });
  galleryFlickr.style.height = layoutFlickr.containerHeight + "px";
  for (let i = 0; i < aspectRatios.length; i++) {
    const item = galleryFlickrItems[i];
    item.style.position = "absolute";
    item.style.top = layoutFlickr.boxes[i].top + "px";
    item.style.left = layoutFlickr.boxes[i].left + "px";
    item.style.width = layoutFlickr.boxes[i].width + "px";
    item.style.height = layoutFlickr.boxes[i].height + "px";
    item.innerHTML = `${Math.round(layoutFlickr.boxes[i].width)}x${Math.round(layoutFlickr.boxes[i].height)}`;
  }

  // @immich/justified-layout-wasm
  const layoutWasm = new JustifiedLayoutWasm(new Float32Array(aspectRatios), {
    rowHeight,
    rowWidth: containerWidth,
    spacing,
    heightTolerance,
  });
  galleryImmich.style.height = layoutWasm.containerHeight + "px";
  for (let i = 0; i < aspectRatios.length; i++) {
    const item = galleryImmichItems[i];
    item.style.position = "absolute";
    item.style.top = layoutWasm.getTop(i) + "px";
    item.style.left = layoutWasm.getLeft(i) + "px";
    item.style.width = layoutWasm.getWidth(i) + "px";
    item.style.height = layoutWasm.getHeight(i) + "px";
    item.innerHTML = `${layoutWasm.getWidth(i).toFixed(2)}x${layoutWasm.getHeight(i).toFixed(2)}`;
  }

  // updated JS implementation
  const layoutJs = new JustifiedLayoutJs(aspectRatios, {
    rowHeight,
    rowWidth: containerWidth,
    spacing,
    heightTolerance,
  });
  galleryNew.style.height = layoutJs.containerHeight + "px";
  for (let i = 0; i < aspectRatios.length; i++) {
    const item = galleryNewItems[i];
    item.style.position = "absolute";
    item.style.top = layoutJs.getTop(i) + "px";
    item.style.left = layoutJs.getLeft(i) + "px";
    item.style.width = layoutJs.getWidth(i) + "px";
    item.style.height = layoutJs.getHeight(i) + "px";
    item.innerHTML = `${layoutJs.getWidth(i).toFixed(2)}x${layoutJs.getHeight(i).toFixed(2)}`;
  }
}

updateGallery();

window.addEventListener("resize", updateGallery);
window.addEventListener("orientationchange", updateGallery);
