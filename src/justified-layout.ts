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

        let maxRowHeight = rowHeight * (1.0 + heightTolerance);
        let curRowWidth = 0.0;
        let maxActualRowWidth = 0.0;
        let rowStartIdx = 0;
        let top = 0.0;

        for (let i = 0; i <= aspectRatios.length; i++) {
            console.log('item', i);
            const aspectRatio = aspectRatios[i];
            const boxWidth = aspectRatio * rowHeight;
            curRowWidth += boxWidth;

            // there are no more boxes that can fit in this row
            if (curRowWidth > rowWidth && i > 0) {
                console.log('more');
                let aspectRatioRow = aspectRatios.slice(rowStartIdx, i);

                // treat the row's boxes as a single entity and scale them to fit the row width
                const totalAspectRatio = aspectRatioRow.reduce((sum, ar) => sum + ar, 0);
                let spacingPixels = spacing * (aspectRatioRow.length - 1);
                let scaledRowHeight = Math.min((rowWidth - spacingPixels) / totalAspectRatio, maxRowHeight);
                console.log(rowHeight, scaledRowHeight);

                let actualRowWidth = spacingPixels;
                let left = 0.0;

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

        // this is the same as in the for loop and processes the last row
        // inlined because it ends up producing much better assembly
        let aspectRatioRow = aspectRatios.slice(rowStartIdx);
        let totalAspectRatio = aspectRatioRow.reduce((sum, ar) => sum + ar, 0);
        let spacingPixels = spacing * (aspectRatioRow.length - 1);
        let scaledRowHeight = Math.min((rowWidth - spacingPixels) / totalAspectRatio, maxRowHeight);

        let actualRowWidth = spacingPixels;
        let left = 0.0;

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
    }
}
