<template>
  <div>
    <input type="file" multiple @change="handleFileUpload" accept="image/*" />
    <div class="image-grid">
      <div v-for="(image, index) in images" :key="index" class="image-container">
        <img
          :src="image.src"
          alt="Uploaded Character"
          style="max-width: 150px; display: block; margin-top: 10px;"
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
      const files = Array.from(event.target.files).slice(0, 40);
      this.images = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
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

      const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
      const colorCounts = {};
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i],
          g = imageData[i + 1],
          b = imageData[i + 2],
          a = imageData[i + 3];
        if (
          a === 0 ||
          (r === 0 && g === 0 && b === 0) ||
          (r === 255 && g === 255 && b === 255)
        )
          continue;
        const hsv = this.rgbToHsv(r, g, b);
        const key = `${Math.round(hsv.h)},${Math.round(hsv.s)},${Math.round(
          hsv.v
        )}`;
        colorCounts[key] = (colorCounts[key] || 0) + 1;
      }

      const sortedColors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);
      const weights = [
        0.2,
        0.1,
        0.14,
        0.12,
        0.1,
        0.08,
        0.08,
        0.06,
        0.06,
        0.06,
        0.04,
        0.04,
        0.02,
        0.02,
        0.02,
        0.02,
        0.02,
        0.02,
        0.02,
        0.02
      ];
      let hSum = 0,
        sSum = 0,
        vSum = 0,
        totalWeight = 0;

      sortedColors.forEach(([key], index) => {
        if (index >= weights.length) return;
        const [h, s, v] = key.split(",").map(Number);
        hSum += h * weights[index];
        sSum += s * weights[index];
        vSum += v * weights[index];
        totalWeight += weights[index];
      });

      const avgH = hSum / totalWeight;
      const avgS = sSum / totalWeight;
      const avgV = vSum / totalWeight;
      this.images.push({
        src,
        personalColor: this.findClosestPersonalColor(avgH, avgS, avgV)
      });
    },
    rgbToHsv(r, g, b) {
      (r /= 255), (g /= 255), (b /= 255);
      let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      let h,
        s,
        v = max,
        d = max - min;
      s = max === 0 ? 0 : d / max;
      if (max === min) h = 0;
      else
        h =
          max === r
            ? (g - b) / d + (g < b ? 6 : 0)
            : max === g
            ? (b - r) / d + 2
            : (r - g) / d + 4;
      h /= 6;
      return { h: h * 360, s: s * 100, v: v * 100 };
    },
    findClosestPersonalColor(h, s, v) {
      const personalColors = [
        { tone: "봄웜 브라이트", h: [0, 30], s: 60, v: 55 }, // 채도(S) 기준 상향
        { tone: "봄웜 트루", h: [30, 50], s: 50, v: 50 },
        { tone: "봄웜 라이트", h: [50, 80], s: 40, v: 50 },

        { tone: "여름쿨 라이트", h: [110, 140], s: 30, v: 45 },
        { tone: "여름쿨 브라이트", h: [140, 170], s: 35, v: 45 },
        { tone: "여름쿨 뮤트", h: [170, 220], s: 25, v: 40 },

        { tone: "가을웜 뮤트", h: [40, 120], s: 20, v: 30 }, // Hue 범위 확장
        { tone: "가을웜 스트롱", h: [80, 170], s: 30, v: 35 },
        { tone: "가을웜 딥", h: [50, 200], s: 15, v: 20 }, // Hue 최대 범위 확장

        { tone: "겨울쿨 브라이트", h: [200, 270], s: 45, v: 55 },
        { tone: "겨울쿨 스트롱", h: [180, 280], s: 30, v: 35 },
        { tone: "겨울쿨 다크", h: [270, 360], s: 50, v: 40 }
      ];

      return personalColors.reduce(
        (closest, color) => {
          const midH = (color.h[0] + color.h[1]) / 2;
          const diff =
            Math.abs(midH - h) + Math.abs(color.s - s) + Math.abs(color.v - v);
          return diff < closest.diff
            ? { tone: color.tone, diff: diff }
            : closest;
        },
        { tone: "겨울쿨 다크", diff: Infinity }
      ).tone;
    }
  }
};
</script>

<style>
.image-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
}
.image-container {
  text-align: center;
}
</style>
