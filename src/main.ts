import { JustifiedLayout } from '@immich/justified-layout-wasm';
import justifiedLayout from 'justified-layout';

const app = document.getElementById("app");

const aspectRatios = [1.5, 0.6666666666666666, 1.3274336283185841, 1.3333333333333333, 0.7516666666666667, 1.5, 0.665, 1.4018691588785046, 1.3392857142857142];
const containerWidth = 350;

// justified-layout
const layoutOld = justifiedLayout(aspectRatios, {
    targetRowHeight: 75,
    containerWidth,
    boxSpacing: 4,
    targetRowHeightTolerance: 0.15,
    containerPadding: 0,
});


const galleryOld = document.createElement('div');
galleryOld.style.border = '1px solid magenta';
galleryOld.style.width = containerWidth + 'px';
galleryOld.style.height = layoutOld.containerHeight + "px";
galleryOld.style.position = 'relative';
galleryOld.style.marginBottom = '10px';

for (let i = 0; i < aspectRatios.length; i++) {
    const item = document.createElement('div');
    item.style.background = 'lightblue';
    item.style.position = "absolute";
    item.style.top = layoutOld.boxes[i].top + "px";
    item.style.left = layoutOld.boxes[i].left + "px";
    item.style.width = layoutOld.boxes[i].width + "px";
    item.style.height = layoutOld.boxes[i].height + "px";
    item.innerHTML = `${Math.round(layoutOld.boxes[i].width)}x${Math.round(layoutOld.boxes[i].height)}`
    galleryOld.appendChild(item);
}

app.appendChild(galleryOld);

// @immich/justified-layout-wasm
const layoutNew = new JustifiedLayout(new Float32Array(aspectRatios), {
    rowHeight: 75,
    rowWidth: containerWidth,
    spacing: 4,
    heightTolerance: 0.15,
});

const galleryNew = document.createElement('div');
galleryNew.style.border = '1px solid red';
galleryNew.style.width = layoutNew.containerWidth + 'px';
galleryNew.style.height = layoutNew.containerHeight + "px";
galleryNew.style.position = 'relative';

for (let i = 0; i < aspectRatios.length; i++) {
    const item = document.createElement('div');
    item.style.background = 'lightgreen';
    item.style.position = "absolute";
    item.style.top = layoutNew.getTop(i) + "px";
    item.style.left = layoutNew.getLeft(i) + "px";
    item.style.width = layoutNew.getWidth(i) + "px";
    item.style.height = layoutNew.getHeight(i) + "px";

    item.innerHTML = `${layoutNew.getWidth(i)}x${layoutNew.getHeight(i)}`;
    galleryNew.appendChild(item);
}

app.appendChild(galleryNew);

