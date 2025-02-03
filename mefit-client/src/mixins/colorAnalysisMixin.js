export default {
    methods: {
        async extractColors(img) {
            return new Promise((resolve) => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(
                    0,
                    0,
                    img.width,
                    img.height
                ).data;
                const colorCounts = {};

                for (let i = 0; i < imageData.length; i += 4) {
                    const r = imageData[i];
                    const g = imageData[i + 1];
                    const b = imageData[i + 2];

                    // 흰색과 검은색 제외
                    if (
                        (r === 255 && g === 255 && b === 255) ||
                        (r === 0 && g === 0 && b === 0)
                    ) {
                        continue;
                    }

                    const hsv = this.rgbToHsv(r, g, b);
                    const roundedH = Math.round(hsv.h / 5) * 5;
                    const roundedS = Math.round(hsv.s / 5) * 5;
                    const roundedV = Math.round(hsv.v / 5) * 5;
                    const key = `${roundedH},${roundedS},${roundedV}`;

                    colorCounts[key] = (colorCounts[key] || 0) + 1;
                }

                const sortedColors = Object.entries(colorCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([color]) => color)
                    .slice(0, 30);

                resolve(sortedColors);
            });
        },
        // RGB → HSV 변환
        rgbToHsv(r, g, b) {
            r /= 255;
            g /= 255;
            b /= 255;

            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const d = max - min;

            let h = 0,
                s = max === 0 ? 0 : d / max,
                v = max;

            if (max !== min) {
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }
                h /= 6;
            }

            return { h: h * 360, s: s * 100, v: v * 100 };
        },

        // HSV → HEX 변환
        hsvToHex(h, s, v) {
            s /= 100;
            v /= 100;

            const c = v * s;
            const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
            const m = v - c;

            let r = 0,
                g = 0,
                b = 0;

            if (h >= 0 && h < 60) {
                r = c;
                g = x;
            } else if (h >= 60 && h < 120) {
                r = x;
                g = c;
            } else if (h >= 120 && h < 180) {
                g = c;
                b = x;
            } else if (h >= 180 && h < 240) {
                g = x;
                b = c;
            } else if (h >= 240 && h < 300) {
                r = x;
                b = c;
            } else {
                r = c;
                b = x;
            }

            r = Math.round((r + m) * 255);
            g = Math.round((g + m) * 255);
            b = Math.round((b + m) * 255);

            return `#${((1 << 24) + (r << 16) + (g << 8) + b)
                .toString(16)
                .slice(1)}`;
        },

        // 퍼스널 컬러 분석
        analyzePersonalColor(sortedColors) {
            let hSum = 0,
                sSum = 0,
                vSum = 0,
                totalWeight = 0;
            const weights = sortedColors.map((_, index) =>
                index < 20 ? 0.1 : 0.02
            );

            sortedColors.forEach((key, index) => {
                const [h, s, v] = key.split(",").map(Number);
                const weight = weights[index];
                hSum += h * weight;
                sSum += s * weight;
                vSum += v * weight;
                totalWeight += weight;
            });

            const avgH = hSum / totalWeight;
            const avgS = sSum / totalWeight;
            const avgV = vSum / totalWeight;

            return this.findClosestPersonalColor(avgH, avgS, avgV);
        },

        // 메인/서브 컬러 분석
        analyzeMainAndSubColors(sortedColors) {
            const groupedSortedColors = this.groupColorsByRange(sortedColors);

            // HEX 변환 후 흰색/검은색 제외
            const filteredColors = groupedSortedColors
                .filter((colorKey) => {
                    const [h, s, v] = colorKey.split(",").map(Number);
                    const hexColor = this.hsvToHex(h, s, v);
                    return (
                        hexColor.toLowerCase() !== "#ffffff" &&
                        hexColor.toLowerCase() !== "#000000"
                    );
                })
                .slice(0, 8);

            // 메인 컬러와 서브 컬러로 나누어 반환
            return {
                mainColors: filteredColors.slice(0, 4).map((colorKey) => {
                    const [h, s, v] = colorKey.split(",").map(Number);
                    return this.hsvToHex(h, s, v);
                }),
                subColors: filteredColors.slice(4).map((colorKey) => {
                    const [h, s, v] = colorKey.split(",").map(Number);
                    return this.hsvToHex(h, s, v);
                }),
            };
        },

        // 컬러 그룹화 (HSV 값을 10 단위로 통합)
        groupColorsByRange(colors) {
            const groupedColors = {};

            colors.forEach((colorKey) => {
                const [h, s, v] = colorKey.split(",").map(Number);
                const roundedH = Math.round(h / 10) * 10;
                const roundedS = Math.round(s / 10) * 10;
                const roundedV = Math.round(v / 10) * 10;
                const groupedKey = `${roundedH},${roundedS},${roundedV}`;
                groupedColors[groupedKey] =
                    (groupedColors[groupedKey] || 0) + 1;
            });

            return Object.entries(groupedColors)
                .sort((a, b) => b[1] - a[1])
                .map(([key]) => key);
        },

        // 가장 가까운 퍼스널 컬러 찾기
        findClosestPersonalColor(h, s, v) {
            const personalColors = [
                { tone: "봄웜 브라이트", h: [0, 30], s: 60, v: 55 },
                { tone: "봄웜 트루", h: [30, 50], s: 50, v: 50 },
                { tone: "봄웜 라이트", h: [50, 80], s: 40, v: 50 },

                { tone: "여름쿨 라이트", h: [110, 140], s: 30, v: 45 },
                { tone: "여름쿨 브라이트", h: [140, 170], s: 35, v: 45 },
                { tone: "여름쿨 뮤트", h: [170, 220], s: 25, v: 40 },

                { tone: "가을웜 뮤트", h: [40, 120], s: 20, v: 30 },
                { tone: "가을웜 스트롱", h: [80, 170], s: 30, v: 35 },
                { tone: "가을웜 딥", h: [50, 200], s: 15, v: 20 },

                { tone: "겨울쿨 브라이트", h: [200, 270], s: 45, v: 55 },
                { tone: "겨울쿨 스트롱", h: [180, 280], s: 30, v: 35 },
                { tone: "겨울쿨 다크", h: [270, 360], s: 50, v: 40 },
            ];

            return personalColors.reduce(
                (closest, color) => {
                    const midH = (color.h[0] + color.h[1]) / 2;
                    const diff =
                        Math.abs(midH - h) +
                        Math.abs(color.s - s) +
                        Math.abs(color.v - v);
                    return diff < closest.diff
                        ? { tone: color.tone, diff }
                        : closest;
                },
                { tone: "겨울쿨 다크", diff: Infinity }
            ).tone;
        },
    },
};
