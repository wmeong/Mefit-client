export default {
  data() {
    return {
      imageData: [],
      personalColorCategories: [
        {
          tone: "봄웜 라이트",
          hRange: [15, 65],
          sRange: [20, 60],
          vRange: [55, 90],
        },
        {
          tone: "봄웜 브라이트",
          hRange: [0, 30],
          sRange: [40, 90],
          vRange: [65, 95],
        },
        {
          tone: "봄웜 트루",
          hRange: [20, 50],
          sRange: [35, 75],
          vRange: [55, 85],
        },
        {
          tone: "여름쿨 라이트",
          hRange: [120, 160],
          sRange: [15, 30],
          vRange: [50, 65],
        },
        {
          tone: "여름쿨 브라이트",
          hRange: [140, 180],
          sRange: [35, 70],
          vRange: [65, 90],
        },
        {
          tone: "여름쿨 뮤트",
          hRange: [190, 230],
          sRange: [10, 30],
          vRange: [45, 65],
        },
        {
          tone: "가을웜 뮤트",
          hRange: [35, 75],
          sRange: [15, 40],
          vRange: [40, 65],
        },
        {
          tone: "가을웜 스트롱",
          hRange: [40, 90],
          sRange: [50, 60],
          vRange: [50, 70],
        },
        {
          tone: "가을웜 딥",
          hRange: [0, 60],
          sRange: [35, 60],
          vRange: [20, 50],
        },
        {
          tone: "겨울쿨 브라이트",
          hRange: [200, 260],
          sRange: [45, 80],
          vRange: [75, 100],
        },
        {
          tone: "겨울쿨 스트롱",
          hRange: [240, 290],
          sRange: [40, 70],
          vRange: [45, 80],
        },
        {
          tone: "겨울쿨 다크",
          hRange: [270, 360],
          sRange: [20, 55],
          vRange: [10, 40],
        },
      ],
    };
  },
  methods: {
    async extractColors(img) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
      const colorCounts = {};
      const pixelPositions = {};

      for (let i = 0; i < imageData.length; i += 4) {
        const [r, g, b, a] = imageData.slice(i, i + 4);
        if (a === 0) continue; // 투명 픽셀 제외

        const hsv = this.rgbToHsv(r, g, b);
        if (hsv.v < 5 || hsv.v > 95 || hsv.s < 5) continue; // 너무 어둡거나 밝거나 채도가 낮은 색상 제외

        const key = `${Math.round(hsv.h / 5) * 5},${
          Math.round(hsv.s / 5) * 5
        },${Math.round(hsv.v / 5) * 5}`;
        colorCounts[key] = (colorCounts[key] || 0) + 1;

        // 픽셀 위치 정보 저장 (면적 분석용)
        const pixelIndex = i / 4;
        const y = Math.floor(pixelIndex / img.width);
        const x = pixelIndex % img.width;
        if (!pixelPositions[key]) pixelPositions[key] = [];
        pixelPositions[key].push({ x, y });
      }

      // 면적 기반 가중치 적용
      for (const key in colorCounts) {
        const connectedArea = this.calculateConnectedArea(pixelPositions[key]);
        colorCounts[key] += connectedArea * 0.5; // 가중치 부여
      }

      return Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 30)
        .map(([color]) => color);
    },

    calculateConnectedArea(pixels) {
      const visited = new Set();
      let area = 0;

      const isConnected = (px1, px2) => {
        const dx = Math.abs(px1.x - px2.x);
        const dy = Math.abs(px1.y - px2.y);
        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
      };

      const explore = (pixel) => {
        if (visited.has(`${pixel.x},${pixel.y}`)) return;
        visited.add(`${pixel.x},${pixel.y}`);
        area++;

        for (const neighbor of pixels) {
          if (isConnected(pixel, neighbor)) {
            explore(neighbor);
          }
        }
      };

      pixels.forEach((pixel) => explore(pixel));
      return area;
    },

    analyzeMainAndSubColors(sortedColors) {
      return {
        mainColors: sortedColors
          .slice(0, 4)
          .map((colorKey) => this.hsvToHex(...colorKey.split(",").map(Number))),
        subColors: sortedColors
          .slice(4, 8)
          .map((colorKey) => this.hsvToHex(...colorKey.split(",").map(Number))),
      };
    },

    determinePersonalColor(mainColors, subColors) {
      const allColors = [...mainColors, ...subColors];

      // Step 1: 메인컬러 기준 퍼스널컬러 분석
      const primaryColor = mainColors.length > 0 ? mainColors[0] : "#000000";
      const { h, s, v } = this.hexToHsv(primaryColor);
      let personalColor = this.getBasePersonalColor(h, s, v);

      // Step 2: 서브컬러 조정 적용
      personalColor = this.adjustForSubColors(allColors, h, s, v);

      // 봄 매칭
      if (v > 65 && s > 40 && s < 70) {
        return this.findClosestPersonalColor(h, s, v, ["봄웜 브라이트"]);
      }

      if (v >= 55 && v < 75 && s >= 20 && s < 45) {
        return this.findClosestPersonalColor(h, s, v, ["봄웜 라이트"]);
      }

      if (v >= 60 && s >= 35 && s < 65) {
        return this.findClosestPersonalColor(h, s, v, ["봄웜 트루"]);
      }

      // Step 3: 어두운색일 경우 겨울쿨 다크 우선 매칭
      if (v > 70 && s > 45) {
        return this.findClosestPersonalColor(h, s, v, ["겨울쿨 브라이트"]);
      }

      if (v < 30) {
        if (s < 25) {
          // 매우 어둡고 채도가 낮은 경우 특정 카테고리로 바로 분류
          return this.findClosestPersonalColor(h, s, v, ["겨울쿨 다크"]);
        }
        // 어둡지만 채도가 낮지 않은 경우 추가로 겨울쿨 다크, 스트롱 중에서 선택
        return this.findClosestPersonalColor(h, s, v, [
          "겨울쿨 다크",
          "겨울쿨 스트롱",
        ]);
      }

      // Step 4: 가중치 적용 후 추가 조정
      const weight = this.adjustToneWeights(personalColor);
      if (weight > 1.0) {
        personalColor = this.findClosestPersonalColor(h, s, v, [personalColor]);
      }

      // Step 5: 특정 톤의 과다 발생에 따른 추가 보정
      if (personalColor === "여름쿨 뮤트") {
        const subBalance = this.adjustForBalance(
          mainColors,
          subColors,
          "여름쿨 브라이트",
          "여름쿨 라이트"
        );
        if (subBalance) return subBalance;
      }

      // 가을웜 조정
      if (personalColor === "가을웜 스트롱") {
        const subBalance = this.adjustForBalance(
          mainColors,
          subColors,
          "가을웜 뮤트",
          "가을웜 딥"
        );
        if (subBalance) return subBalance;
      }

      if (personalColor === "가을웜 뮤트") {
        // 서브컬러에 차가운 색조가 많은 경우 여름쿨 뮤트로 변경
        const coolTones = subColors.filter((color) => {
          const { h } = this.hexToHsv(color);
          return h >= 150 && h <= 250; // 여름쿨 범위의 서브컬러 확인
        });
        if (coolTones.length > 2) {
          return "여름쿨 뮤트";
        }
      }

      if (personalColor === "여름쿨 뮤트") {
        // 서브컬러에 따뜻한 색조가 많다면 가을웜 뮤트로 변경
        const warmTones = subColors.filter((color) => {
          const { h } = this.hexToHsv(color);
          return h >= 30 && h <= 80; // 가을웜 범위의 서브컬러 확인
        });
        if (warmTones.length > 2) {
          return "가을웜 뮤트";
        }
      }

      // 겨울쿨 조정
      if (personalColor === "겨울쿨 다크") {
        const avgBrightness =
          subColors.reduce((sum, color) => {
            const { v } = this.hexToHsv(color);
            return sum + v;
          }, 0) / subColors.length;

        if (avgBrightness > 60 && s > 45) return "겨울쿨 브라이트";
        if (avgBrightness > 45) return "겨울쿨 스트롱";
      }

      // Step 4: 미분류일 경우 가장 가까운 퍼스널컬러 강제 매칭
      if (personalColor === "미분류") {
        personalColor = this.findClosestPersonalColor(h, s, v);
      }

      return this.analyzeColorBalance(mainColors, subColors, personalColor);
    },

    getBasePersonalColor(h, s, v) {
      for (const category of this.personalColorCategories) {
        const [hMin, hMax] = category.hRange;
        const [sMin, sMax] = category.sRange;
        const [vMin, vMax] = category.vRange;

        if (
          h >= hMin &&
          h <= hMax &&
          s >= sMin &&
          s <= sMax &&
          v >= vMin &&
          v <= vMax
        ) {
          return category.tone;
        }
      }
      return "미분류";
    },

    findClosestPersonalColor(h, s, v, specificCategories = null) {
      const categories = specificCategories
        ? this.personalColorCategories.filter((cat) =>
            specificCategories.includes(cat.tone)
          )
        : this.personalColorCategories;

      return categories.reduce(
        (closest, category) => {
          const [hMin, hMax] = category.hRange;
          const [sMin, sMax] = category.sRange;
          const [vMin, vMax] = category.vRange;
          const hMid = (hMin + hMax) / 2;
          const sMid = (sMin + sMax) / 2;
          const vMid = (vMin + vMax) / 2;

          const diff =
            Math.abs(h - hMid) + Math.abs(s - sMid) + Math.abs(v - vMid);
          return diff < closest.diff ? { tone: category.tone, diff } : closest;
        },
        { tone: "미분류", diff: Infinity }
      ).tone;
    },

    adjustForSubColors(allColors, baseH, baseS, baseV) {
      const complementaryTones = allColors.filter((color) => {
        const { h } = this.hexToHsv(color);
        const complementaryHue = (h + 180) % 360;
        return allColors.some((c) => {
          const { h: subH } = this.hexToHsv(c);
          return Math.abs(subH - complementaryHue) <= 20;
        });
      });

      if (complementaryTones.length > 1) {
        return this.findClosestPersonalColor(baseH, baseS, baseV);
      }

      const warmTones = allColors.filter((color) => {
        const { h } = this.hexToHsv(color);
        return h >= 20 && h <= 50;
      });

      const coolTones = allColors.filter((color) => {
        const { h } = this.hexToHsv(color);
        return h >= 150 && h <= 250;
      });

      if (warmTones.length > coolTones.length) {
        return this.findClosestPersonalColor(40, 55, 60, [
          "가을웜 뮤트",
          "가을웜 스트롱",
          "가을웜 딥",
        ]);
      } else {
        return this.findClosestPersonalColor(210, 35, 60, [
          "여름쿨 라이트",
          "여름쿨 브라이트",
          "여름쿨 뮤트",
        ]);
      }
    },

    adjustForBalance(mainColors, subColors, preferredTone1, preferredTone2) {
      const avgSaturation =
        subColors.reduce((sum, color) => {
          const { s } = this.hexToHsv(color);
          return sum + s;
        }, 0) / subColors.length;

      // 채도에 따라 다른 톤으로 조정
      if (avgSaturation >= 50) return preferredTone1;
      if (avgSaturation >= 30) return preferredTone2;

      return null;
    },

    adjustToneWeights(tone) {
      const weightMap = {
        "겨울쿨 다크": 1.0, // 기본 가중치로 설정
        "겨울쿨 스트롱": 1.1, // 약간 높임
        "겨울쿨 브라이트": 1.2, // 우선순위를 높임
      };
      return weightMap[tone] || 1.0;
    },

    analyzeColorBalance(mainColors, subColors, baseColor) {
      const mainColorRatio =
        mainColors.length / (mainColors.length + subColors.length);
      if (mainColorRatio >= 0.6) {
        return baseColor;
      }
      return baseColor;
    },

    rgbToHsv(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      const d = max - min;
      let h = 0,
        s = max === 0 ? 0 : d / max,
        v = max;

      if (max !== min) {
        h =
          max === r
            ? (g - b) / d + (g < b ? 6 : 0)
            : max === g
            ? (b - r) / d + 2
            : (r - g) / d + 4;
        h /= 6;
      }

      return { h: h * 360, s: s * 100, v: v * 100 };
    },

    hsvToHex(h, s, v) {
      s /= 100;
      v /= 100;
      const c = v * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = v - c;
      let [r, g, b] =
        h < 60
          ? [c, x, 0]
          : h < 120
          ? [x, c, 0]
          : h < 180
          ? [0, c, x]
          : h < 240
          ? [0, x, c]
          : h < 300
          ? [x, 0, c]
          : [c, 0, x];

      return `#${[(r + m) * 255, (g + m) * 255, (b + m) * 255]
        .map((n) => Math.round(n).toString(16).padStart(2, "0"))
        .join("")}`;
    },

    hexToHsv(hex) {
      const rgb = parseInt(hex.slice(1), 16);
      return this.rgbToHsv((rgb >> 16) & 0xff, (rgb >> 8) & 0xff, rgb & 0xff);
    },
  },
};
