<template>
    <div>
        <h1>테스트 화면</h1>
        <input
            type="file"
            multiple
            accept="image/*"
            @change="handleFileUpload"
        />
        <div v-if="imageData.length > 0" class="image-grid">
            <div
                v-for="(data, index) in imageData"
                :key="index"
                class="image-item"
            >
                <img :src="data.url" alt="uploaded image" />
                <div class="color-info">
                    <p>퍼스널컬러: {{ data.personalColor }}</p>
                    <p>메인컬러:</p>
                    <div class="colors-row">
                        <span
                            v-for="(color, idx) in data.mainColors"
                            :key="'main-' + idx"
                            class="color-box"
                            :style="{ backgroundColor: color }"
                        ></span>
                    </div>
                    <p>서브컬러:</p>
                    <div class="colors-row">
                        <span
                            v-for="(color, idx) in data.subColors"
                            :key="'sub-' + idx"
                            class="color-box"
                            :style="{ backgroundColor: color }"
                        ></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            imageData: [],
            personalColorsData: {
                "봄웜 라이트": [
                    "#F08080",
                    "#FFFFE0",
                    "#FFDAB9",
                    "#FFF0F5",
                    "#E0FFF0",
                    "#E6E6FA",
                    "#ADD8E6",
                    "#B0E0E6",
                ],
                "봄웜 브라이트": [
                    "#FFA07A",
                    "#FFD1DC",
                    "#F9E79F",
                    "#FF7F50",
                    "#F2D4CC",
                    "#FF2400",
                    "#F8E473",
                    "#FFFDD0",
                ],
                "봄웜 트루": [
                    "#FFB07C",
                    "#FFFDD0",
                    "#FF7F50",
                    "#A0785A",
                    "#E6BE8A",
                    "#F28E63",
                    "#F5BD47",
                    "#FFFFF0",
                ],
                "여름쿨 라이트": [
                    "#ADD8E6",
                    "#E6E6FA",
                    "#B8E2DC",
                    "#FFD1DC",
                    "#D0F0F0",
                    "#C0C0C0",
                    "#AEC6CF",
                    "#E0FFFF",
                ],
                "여름쿨 브라이트": [
                    "#00FFFF",
                    "#D8BFD8",
                    "#C8A2C8",
                    "#7FFFD4",
                    "#CDE7F0",
                    "#DCAE96",
                    "#D3BCCC",
                    "#8EE5EE",
                ],
                "여름쿨 뮤트": [
                    "#DCAE96",
                    "#B0C4DE",
                    "#C8A2C8",
                    "#A9D6CC",
                    "#B0A4E3",
                    "#D8D3E3",
                    "#D0CCE0",
                    "#B0C4E3",
                ],
                "가을웜 뮤트": [
                    "#8B4513",
                    "#F5DEB3",
                    "#808000",
                    "#CD7F32",
                    "#F4A460",
                    "#D2691E",
                    "#7F6A55",
                    "#FFDB58",
                ],
                "가을웜 스트롱": [
                    "#C04000",
                    "#B8860B",
                    "#9B111E",
                    "#A0522D",
                    "#DAA520",
                    "#884C23",
                    "#A45A52",
                    "#FFD700",
                ],
                "가을웜 딥": [
                    "#3F1E12",
                    "#800020",
                    "#FF8C00",
                    "#4B5320",
                    "#8A3324",
                    "#E3963E",
                    "#FFB84D",
                    "#800000",
                ],
                "겨울쿨 브라이트": [
                    "#007FFF",
                    "#FFD1DC",
                    "#32CD32",
                    "#1E90FF",
                    "#009DC4",
                    "#0F52BA",
                    "#FFFFFF",
                    "#FF2400",
                ],
                "겨울쿨 스트롱": [
                    "#001F54",
                    "#4B0082",
                    "#DE3163",
                    "#36454F",
                    "#228B22",
                    "#B22222",
                    "#4169E1",
                    "#00CED1",
                ],
                "겨울쿨 다크": [
                    "#00008B",
                    "#673147",
                    "#722F37",
                    "#2F4F4F",
                    "#191970",
                    "#101820",
                    "#4B0082",
                    "#5B504F",
                ],
            },
        };
    },
    methods: {
        async handleFileUpload(event) {
            const files = Array.from(event.target.files).slice(0, 150);
            this.imageData = [];

            for (const file of files) {
                const url = URL.createObjectURL(file);
                const img = await this.loadImage(url);

                const sortedColors = await this.extractColors(img);
                const { mainColors, subColors } =
                    this.analyzeMainAndSubColors(sortedColors);
                const personalColor = this.determinePersonalColor(
                    mainColors,
                    subColors
                );
                this.imageData.push({
                    url,
                    mainColors,
                    subColors,
                    personalColor,
                });
            }
        },

        loadImage(url) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.src = url;
            });
        },

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

                    if (
                        (r === 255 && g === 255 && b === 255) ||
                        (r === 0 && g === 0 && b === 0)
                    )
                        continue;

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

        analyzeMainAndSubColors(sortedColors) {
            const groupedSortedColors = sortedColors.slice(0, 8);

            return {
                mainColors: groupedSortedColors
                    .slice(0, 4)
                    .map((colorKey) =>
                        this.hsvToHex(...colorKey.split(",").map(Number))
                    ),
                subColors: groupedSortedColors
                    .slice(4)
                    .map((colorKey) =>
                        this.hsvToHex(...colorKey.split(",").map(Number))
                    ),
            };
        },

        determinePersonalColor(mainColors, subColors) {
            const allColors = [...mainColors, ...subColors];

            // 메인컬러 1등 가져오기
            const primaryColor = mainColors[0];
            const { h } = this.hexToHsv(primaryColor);

            // 1. 메인컬러가 갈색 계열이면 강제 가을 분류
            if (h >= 20 && h <= 50) {
                return this.determineAutumnTone(allColors);
            }

            // 2. 어두운 색상 분류
            const darkColorCount = allColors.filter((color) => {
                const { v } = this.hexToHsv(color);

                // 검은색 계열 추가 조건
                const isBlackColor = ["#1A1A1A", "#333333", "#4D4D4D"].includes(
                    color.toUpperCase()
                );

                // V 값이 낮거나 검은색 계열로 간주되는 경우
                return v <= 20 || isBlackColor;
            }).length;

            const isPrimaryBlack = ["#1A1A1A", "#333333", "#4D4D4D"].includes(
                primaryColor.toUpperCase()
            );

            if (isPrimaryBlack) {
                return "겨울쿨 다크";
            }
            // 어두운 색 비율이 50% 이상이면 겨울쿨 다크로 분류
            if (darkColorCount / allColors.length >= 0.4) {
                return "겨울쿨 다크";
            }

            // 3. 보라/핑크 계열 분류
            const purpleCount = allColors.filter((color) => {
                const { h } = this.hexToHsv(color);
                return h >= 260 && h <= 310;
            }).length;

            if (purpleCount / allColors.length >= 0.3) {
                const strongPurple = allColors.some((color) => {
                    const { s, v } = this.hexToHsv(color);
                    return s >= 60 && v <= 60;
                });

                if (strongPurple) return "겨울쿨 스트롱";

                const brightPurple = allColors.some((color) => {
                    const { s, v } = this.hexToHsv(color);
                    return s >= 40 && v >= 70;
                });

                if (brightPurple) return "겨울쿨 브라이트";
            }

            // 4. 기본 매칭 로직
            const matchedTone = this.matchColorGroupByHex(allColors);
            if (matchedTone) return matchedTone;

            const fallbackHSV = this.analyzeFallbackHSV(mainColors);
            return this.findClosestPersonalColor(
                fallbackHSV.h,
                fallbackHSV.s,
                fallbackHSV.v
            );
        },

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
        determineAutumnTone(colors) {
            // 1. 강한 브라운 계열을 우선 평가
            const strongBrown = colors.some((color) => {
                const { h, s, v } = this.hexToHsv(color);
                return h >= 20 && h <= 50 && s >= 50 && v >= 50;
            });
            if (strongBrown) return "가을웜 스트롱";

            // 2. 연한 톤 조건
            const lightTone = colors.some((color) => {
                const { s, v } = this.hexToHsv(color);
                return s <= 30 && v >= 70;
            });
            if (lightTone) return "가을웜 뮤트";

            // 3. 딥 브라운 또는 버건디 조건
            const deepBrownOrBurgundy = colors.some((color) => {
                const { h, s, v } = this.hexToHsv(color);
                return (
                    (h >= 0 && h <= 20) ||
                    (h >= 300 && h <= 360) ||
                    (h >= 50 && h <= 100 && s >= 40 && v <= 40)
                );
            });
            if (deepBrownOrBurgundy) return "가을웜 딥";

            // 4. 뮤트 브라운 기본 조건
            const mutedBrown = colors.some((color) => {
                const { h, s, v } = this.hexToHsv(color);
                return (
                    h >= 20 &&
                    h <= 50 &&
                    s >= 15 &&
                    s <= 50 &&
                    v >= 40 &&
                    v <= 70
                );
            });
            if (mutedBrown) return "가을웜 뮤트";

            return "가을웜 뮤트"; // 기본 반환값
        },

        hexToHsv(hex) {
            const rgb = parseInt(hex.substring(1), 16);
            const r = (rgb >> 16) & 0xff;
            const g = (rgb >> 8) & 0xff;
            const b = rgb & 0xff;
            return this.rgbToHsv(r, g, b);
        },

        matchColorGroupByHex(colors) {
            for (const [tone, colorList] of Object.entries(
                this.personalColorsData
            )) {
                if (colors.some((color) => colorList.includes(color))) {
                    return tone;
                }
            }
            return null;
        },

        // 퍼스널컬러 중 기본 매칭 실패 시 HSV 값 기반 최근접 컬러 분석
        analyzeFallbackHSV(colors) {
            const weights = [25, 20, 15, 10, 8, 6, 4, 2]; // 각 주요 색상에 대한 우선순위

            let hSum = 0,
                sSum = 0,
                vSum = 0,
                weightSum = 0;

            colors.forEach((hex, index) => {
                const { h, s, v } = this.hexToHsv(hex);
                const weight = weights[index] || 1;

                hSum += h * weight;
                sSum += s * weight;
                vSum += v * weight;
                weightSum += weight;
            });

            return {
                h: hSum / weightSum,
                s: sSum / weightSum,
                v: vSum / weightSum,
            };
        },
        findClosestPersonalColor(h, s, v) {
            const personalColors = [
                { tone: "봄웜 브라이트", h: [0, 30], s: 60, v: 55 }, //12개
                { tone: "봄웜 트루", h: [30, 50], s: 50, v: 50 }, //12개
                { tone: "봄웜 라이트", h: [50, 80], s: [30, 50], v: [45, 60] }, //0개
                {
                    tone: "여름쿨 라이트", //0개
                    h: [110, 140],
                    s: [25, 45],
                    v: [40, 60],
                },
                { tone: "여름쿨 브라이트", h: [140, 170], s: 35, v: 45 },
                { tone: "여름쿨 뮤트", h: [170, 220], s: 25, v: 40 }, //6개
                { tone: "가을웜 뮤트", h: [40, 120], s: [15, 35], v: [20, 50] }, //8개
                { tone: "가을웜 스트롱", h: [70, 170], s: 50, v: [40, 70] }, //12개
                { tone: "가을웜 딥", h: [20, 50], s: 20, v: 30 }, //39개
                { tone: "겨울쿨 브라이트", h: [200, 270], s: 45, v: 55 }, //15개
                { tone: "겨울쿨 스트롱", h: [180, 280], s: 30, v: 35 }, //3개
                { tone: "겨울쿨 다크", h: [270, 360], s: 50, v: 40 }, //29개(가을웜 딥으로 분류돼야할 거 여기로 몇개 왔음)
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
        // 그룹별 색상 정렬 후 반환
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
        // 이미지는 잘라내기/크기 조정 후 추가 분석할 수 있습니다.
        cropAndResizeImage(img, width, height) {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            return canvas.toDataURL();
        },
    },
};
</script>

<style>
.image-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 15px;
    margin-top: 20px;
}
.image-item {
    text-align: center;
    border: 1px solid #ddd;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 12px;
}
.color-info p {
    margin: 8px 0;
    font-size: 16px;
}
.colors-row {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 10px 0;
}
.color-box {
    display: inline-block;
    width: 30px;
    height: 30px;
    border: 1px solid #aaa;
    border-radius: 50%;
}
</style>


