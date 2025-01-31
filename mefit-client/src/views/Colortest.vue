<template>
    <div>
        <input
            type="file"
            multiple
            @change="handleFileUpload"
            accept="image/*"
        />
        <div class="image-grid">
            <div
                v-for="(image, index) in images"
                :key="index"
                class="image-container"
            >
                <img
                    :src="image.src"
                    alt="Uploaded Character"
                    class="avatar-img"
                />
                <h2>{{ image.personalColor }}</h2>
            </div>
        </div>
        <canvas ref="canvas" style="display: none"></canvas>
    </div>
</template>

<script>
export default {
    data() {
        return { images: [] };
    },
    methods: {
        handleFileUpload(event) {
            const files = Array.from(event.target.files).slice(0, 150);
            this.images = [];
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.src = e.target.result;
                    img.onload = () => {
                        this.extractColors(img, e.target.result);
                    };
                };
                reader.readAsDataURL(file);
            });
        },

        extractColors(img, src) {
            const canvas = this.$refs.canvas;
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
                const a = imageData[i + 3];

                // ✅ 투명도 및 완전 검정/흰색 제외
                if (
                    a === 0 ||
                    (r === 0 && g === 0 && b === 0) ||
                    (r === 255 && g === 255 && b === 255)
                )
                    continue;

                const hsv = this.rgbToHsv(r, g, b);

                // ✅ 너무 어둡거나 밝은 색상 제거
                if (hsv.v < 5 || hsv.v > 90) continue;

                // ✅ 채도가 매우 낮은 색상 제거
                if (hsv.s < 3) continue;

                // **HSV 근처 색상 통합**을 위해 5단위로 근접 색상 통합
                const roundedH = Math.round(hsv.h / 5) * 5; // Hue 값을 5단위로 통합
                const roundedS = Math.round(hsv.s / 5) * 5; // Saturation을 5단위로 통합
                const roundedV = Math.round(hsv.v / 5) * 5; // Value를 5단위로 통합
                const key = `${roundedH},${roundedS},${roundedV}`;

                colorCounts[key] = (colorCounts[key] || 0) + 1;
            }

            // ✅ 상위 30개 색상 추출 및 정렬
            const sortedColors = Object.entries(colorCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 30);

            // ✅ 가중치 부여
            const weights = sortedColors.map((_, index) => {
                if (index < 20) {
                    // 상위 20개에 높은 가중치
                    return (
                        [
                            0.2, 0.1, 0.14, 0.12, 0.1, 0.08, 0.08, 0.06, 0.04,
                            0.04,
                        ][index] || 0.02
                    );
                } else {
                    // 나머지 10개는 낮은 가중치 부여
                    return 0.02;
                }
            });

            // ✅ 평균 HSV 값 계산
            let hSum = 0,
                sSum = 0,
                vSum = 0,
                totalWeight = 0;
            sortedColors.forEach(([key], index) => {
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

            // ✅ 최종 퍼스널컬러 분류
            this.images.push({
                src,
                personalColor: this.findClosestPersonalColor(avgH, avgS, avgV),
            });
        },
        rgbToHsv(r, g, b) {
            (r /= 255), (g /= 255), (b /= 255);
            const max = Math.max(r, g, b),
                min = Math.min(r, g, b);
            const d = max - min;
            const s = max === 0 ? 0 : d / max;
            let h;

            if (max === min) h = 0;
            else {
                h =
                    max === r
                        ? (g - b) / d + (g < b ? 6 : 0)
                        : max === g
                        ? (b - r) / d + 2
                        : (r - g) / d + 4;
                h /= 6;
            }

            return { h: h * 360, s: s * 100, v: max * 100 };
        },

        mergeSimilarColors(colors) {
            const thresholdH = 10,
                thresholdSV = 15;
            const mergedColors = [];

            colors.forEach(([key, count]) => {
                const [h, s, v] = key.split(",").map(Number);
                let merged = false;

                for (const group of mergedColors) {
                    const [groupH, groupS, groupV] = group.hsv;
                    if (
                        Math.abs(groupH - h) < thresholdH &&
                        Math.abs(groupS - s) < thresholdSV &&
                        Math.abs(groupV - v) < thresholdSV
                    ) {
                        group.count += count;
                        merged = true;
                        break;
                    }
                }

                if (!merged) {
                    mergedColors.push({ hsv: [h, s, v], count });
                }
            });

            return mergedColors;
        },

        findClosestPersonalColor(h, s, v) {
            if (v < 10) return "겨울쿨 다크";

            if (h >= 0 && h <= 60 && s >= 40 && v >= 60) return "봄웜 브라이트";
            if (h >= 0 && h <= 50 && v >= 70 && s >= 30) return "봄웜 라이트";

            if (h >= 100 && h <= 170 && s >= 10 && v >= 10 && v <= 40)
                return "가을웜 딥";

            if (h >= 30 && h <= 70 && s >= 20 && v >= 30 && v <= 50)
                return "가을웜 뮤트";
            if (h >= 40 && h <= 120 && s >= 30 && v >= 50)
                return "가을웜 스트롱";

            const personalColors = [
                { tone: "봄웜 라이트", h: [40, 85], s: 30, v: 60 },
                { tone: "봄웜 브라이트", h: [0, 25], s: 60, v: 55 },
                { tone: "봄웜 트루", h: [25, 50], s: 50, v: 50 },

                { tone: "여름쿨 라이트", h: [110, 140], s: 45, v: 60 },
                { tone: "여름쿨 브라이트", h: [140, 170], s: 35, v: 45 },
                { tone: "여름쿨 뮤트", h: [170, 220], s: 25, v: 40 },
                { tone: "가을웜 뮤트", h: [30, 70], s: 20, v: 30 },
                { tone: "가을웜 딥", h: [100, 170], s: 10, v: 10 },
                { tone: "가을웜 스트롱", h: [70, 120], s: 25, v: 40 },
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
</script>

<style scoped>
.image-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
}
.avatar-img {
    max-width: 150px;
}
</style>
