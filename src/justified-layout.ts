export class JustifiedLayout {
    boxes: { top: number; left: number; width: number; height: number }[] = [];
    containerWidth = 0;
    containerHeight = 0;

    constructor(aspectRatios: number[], { rowHeight, rowWidth, spacing, heightTolerance }: {
        rowHeight: number;
        rowWidth: number;
        spacing: number;
        heightTolerance: number;
    }) {
        if (aspectRatios.length === 0) return;

        const minRowHeight = rowHeight * (1 - heightTolerance);
        const maxRowHeight = rowHeight * (1 + heightTolerance);
        let curAspectRatio = 0.0;
        let rowAspectRatio = 0.0;
        let maxActualRowWidth = 0.0;
        let rowStartIdx = 0;
        let top = 0.0;
        const maxRowAspectRatio = rowWidth / minRowHeight;
        const targetRowAspectRatio = rowWidth / rowHeight;
        const spacingAspectRatio = spacing / rowHeight;

        let rowDiff = targetRowAspectRatio;

        for (let i = 0; i < aspectRatios.length; i++) {
            const aspectRatio = aspectRatios[i];
            curAspectRatio += aspectRatio;
            const curDiff = Math.abs(curAspectRatio - targetRowAspectRatio);

            // there are no more boxes that can fit in this row
            if ((curAspectRatio > maxRowAspectRatio || curDiff > rowDiff) && i > 0) {
                const aspectRatioRow = aspectRatios.slice(rowStartIdx, i);

                // treat the row's boxes as a single entity and scale them to fit the row width
                const totalAspectRatio = rowAspectRatio - (spacingAspectRatio * aspectRatioRow.length);
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
                top += scaledRowHeight + spacing;
                maxActualRowWidth = Math.max(actualRowWidth, maxActualRowWidth);
                rowStartIdx = i;
                curAspectRatio = aspectRatio;
                rowDiff = Math.abs(curAspectRatio - targetRowAspectRatio);
            } else {
                rowDiff = curDiff;
            }

            curAspectRatio += spacingAspectRatio;
            rowAspectRatio = curAspectRatio;
        }

        // this is the same as in the for loop and processes the last row
        // inlined because it ends up producing much better assembly
        const aspectRatioRow = aspectRatios.slice(rowStartIdx);
        const totalAspectRatio = rowAspectRatio - (spacingAspectRatio * aspectRatioRow.length);
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
    }
}
