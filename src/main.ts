// import { JustifiedLayout } from '@immich/justified-layout-wasm';
import { JustifiedLayout } from './justified-layout';
import justifiedLayout from 'justified-layout';

const rowHeight = 100;
const spacing = 4;
const heightTolerance = 0.25;

// ---

const app = document.getElementById("app");

const aspectRatios = [1.5, 0.6666666666666666, 1.3274336283185841, 1.3333333333333333, 0.7516666666666667, 1.5, 0.665, 1.4018691588785046, 1.3392857142857142];
let containerWidth = 0;

const container = document.createElement('div');
app.appendChild(container);

const info = document.createElement('p');
info.innerHTML = `spacing: ${spacing}<br>rowHeight: ${rowHeight} ± ${heightTolerance} (${rowHeight - (rowHeight * heightTolerance)}..${rowHeight + (rowHeight * heightTolerance)})`;
app.appendChild(info);

const galleryOld = document.createElement('div');
galleryOld.style.background = 'lightgrey';
galleryOld.style.position = 'relative';
galleryOld.style.marginBottom = '10px';

for (let i = 0; i < aspectRatios.length; i++) {
    const item = document.createElement('div');
    item.style.background = 'grey';
    galleryOld.appendChild(item);
}
const galleryOldItems = galleryOld.querySelectorAll('div');
container.appendChild(galleryOld);

const galleryNew = document.createElement('div');
galleryNew.style.background = 'lightgrey';
galleryNew.style.position = 'relative';
for (let i = 0; i < aspectRatios.length; i++) {
    const item = document.createElement('div');
    item.style.background = 'grey';
    galleryNew.appendChild(item);
}
const galleryNewItems = galleryNew.querySelectorAll('div');
container.appendChild(galleryNew);

function updateGallery() {
    if (!app) return;
    if (containerWidth === container.getBoundingClientRect().width) return;
    containerWidth = container.getBoundingClientRect().width;

    // justified-layout
    const layoutOld = justifiedLayout(aspectRatios, {
        targetRowHeight: rowHeight,
        containerWidth,
        boxSpacing: spacing,
        targetRowHeightTolerance: heightTolerance,
        containerPadding: 0,
    });

    // galleryOld.style.width = containerWidth + 'px';
    galleryOld.style.height = layoutOld.containerHeight + "px";

    for (let i = 0; i < galleryOldItems.length; i++) {
        const item = galleryOldItems[i];
        item.style.position = "absolute";
        item.style.top = layoutOld.boxes[i].top + "px";
        item.style.left = layoutOld.boxes[i].left + "px";
        item.style.width = layoutOld.boxes[i].width + "px";
        item.style.height = layoutOld.boxes[i].height + "px";
        item.innerHTML = `${Math.round(layoutOld.boxes[i].width)}x${Math.round(layoutOld.boxes[i].height)}`
    }

    // @immich/justified-layout-wasm
    const layoutNew = new JustifiedLayout(aspectRatios, {
        rowHeight,
        rowWidth: containerWidth,
        spacing,
        heightTolerance,
    });

    // galleryNew.style.width = Math.max(containerWidth, layoutNew.containerWidth) + 'px';
    galleryNew.style.height = layoutNew.containerHeight + "px";

    for (let i = 0; i < galleryNewItems.length; i++) {
        const item = galleryNewItems[i];
        item.style.position = "absolute";
        item.style.top = layoutNew.boxes[i].top + "px";
        item.style.left = layoutNew.boxes[i].left + "px";
        item.style.width = layoutNew.boxes[i].width + "px";
        item.style.height = layoutNew.boxes[i].height + "px";
        item.innerHTML = `${layoutNew.boxes[i].width}x${layoutNew.boxes[i].height}`;
    }
}

updateGallery();

window.addEventListener("resize", updateGallery);
window.addEventListener("orientationchange", updateGallery);
