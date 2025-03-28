interface LayoutOptions {
    rowHeight: number;
    rowWidth: number;
    spacing: number;
    heightTolerance: number;
};

export class JustifiedLayout {
    boxes: { top: number; left: number; width: number; height: number }[] = [];
    containerWidth = 0;
    containerHeight = 0;

    constructor(aspectRatios: number[], { rowHeight, rowWidth, spacing, heightTolerance }: LayoutOptions) {
        if (aspectRatios.length === 0) return;

        const minRowHeight = rowHeight * (1 - heightTolerance);
        const maxRowHeight = rowHeight * (1 + heightTolerance);
        let curRowWidth = 0.0;
        let maxActualRowWidth = 0.0;
        let rowStartIdx = 0;
        let top = 0.0;

        for (let i = 0; i <= aspectRatios.length; i++) {
            const aspectRatio = aspectRatios[i];
            const boxWidth = aspectRatio * rowHeight;
            curRowWidth += boxWidth;

            // there are no more boxes that can fit in this row
            if (curRowWidth > rowWidth && i > 0) {
                const aspectRatioRow = aspectRatios.slice(rowStartIdx, i);

                // treat the row's boxes as a single entity and scale them to fit the row width
                const totalAspectRatio = aspectRatioRow.reduce((sum, ar) => sum + ar, 0);
                const spacingPixels = spacing * (aspectRatioRow.length - 1);

                let actualRowWidth = spacingPixels;
                let scaledRowHeight = (rowWidth - spacingPixels) / totalAspectRatio;

                if (scaledRowHeight > maxRowHeight) {
                    const scaledRowHeight2 = (rowWidth - spacingPixels - spacing) / (totalAspectRatio + aspectRatios[i]);

                    if (scaledRowHeight2 >= minRowHeight) {
                        // scaling down is better in this case
                        scaledRowHeight = scaledRowHeight2;
                        actualRowWidth += spacing;
                        aspectRatioRow.push(aspectRatios[i]);
                        i++;
                    } else {
                        console.log('giving up');
                        scaledRowHeight = maxRowHeight;
                    }
                }

                let left = 0;

                for (let j = 0; j < aspectRatioRow.length; j++) {
                    let width = aspectRatioRow[j] * scaledRowHeight;
                    this.boxes[rowStartIdx + j] = {
                        top: Math.round(top),
                        left: Math.round(left),
                        width: Math.round(width),
                        height: Math.round(scaledRowHeight)
                    }
                    left += width + spacing;
                    actualRowWidth += width;
                }
                top += scaledRowHeight + spacing;
                maxActualRowWidth = Math.max(actualRowWidth, maxActualRowWidth);
                rowStartIdx = i;
                curRowWidth = boxWidth;
            }

            curRowWidth += spacing;
        }

        if (rowStartIdx < aspectRatios.length) {
            // this is the same as in the for loop and processes the last row
            // inlined because it ends up producing much better assembly
            const aspectRatioRow = aspectRatios.slice(rowStartIdx);

            const totalAspectRatio = aspectRatioRow.reduce((sum, ar) => sum + ar, 0);
            const spacingPixels = spacing * (aspectRatioRow.length - 1);
            const scaledRowHeight = Math.min((rowWidth - spacingPixels) / totalAspectRatio, maxRowHeight);

            let actualRowWidth = spacingPixels;
            let left = 0;

            for (let j = 0; j < aspectRatioRow.length; j++) {
                let width = aspectRatioRow[j] * scaledRowHeight;
                this.boxes[rowStartIdx + j] = {
                    top: Math.round(top),
                    left: Math.round(left),
                    width: Math.round(width),
                    height: Math.round(scaledRowHeight)
                }
                left += width + spacing;
                actualRowWidth += width;
            }

            this.containerWidth = Math.ceil(Math.max(actualRowWidth, maxActualRowWidth));
            this.containerHeight = Math.ceil(top + scaledRowHeight);
        } else {
            this.containerWidth = Math.ceil(maxActualRowWidth);
            this.containerHeight = Math.ceil(top - spacing);
        }
    }
}
