<template>
  <v-container>
    <v-row class="align-center justify-center">
      <v-col cols="12" md="8" lg="6">
        <h1 class="text-center modern-title mb-5">캐릭터 검색</h1>

        <v-text-field
          v-model="characterName"
          label="캐릭터 이름 입력"
          outlined
          hide-details
          class="mb-4"
          @keyup.enter="searchAndSaveCharacter"
        ></v-text-field>

        <v-btn
          color="primary"
          dark
          @click="searchAndSaveCharacter"
          class="mb-4"
          block
        >
          검색 및 저장
        </v-btn>

        <!-- 캐릭터 정보 카드 -->
        <v-card v-if="character" class="mb-4 pa-4 elevation-2 modern-card">
          <v-card-title class="headline text-center">
            {{ character.character_name }}
          </v-card-title>
          <v-card-subtitle class="text-center">
            <p><strong>월드:</strong> {{ character.world_name }}</p>
            <p><strong>성별:</strong> {{ character.character_gender }}</p>
            <p><strong>직업:</strong> {{ character.character_class }}</p>
            <p><strong>레벨:</strong> {{ character.character_level }}</p>
            <p><strong>길드:</strong> {{ character.character_guild_name }}</p>
          </v-card-subtitle>
          <v-card-text class="d-flex justify-center">
            <!-- 메인 컬러 표시 -->
            <v-col cols="3">
              <h3 class="text-center">메인컬러</h3>
              <v-row>
                <v-col
                  v-for="(color, index) in character.main_colors"
                  :key="'main-color-' + index"
                  class="d-flex justify-center mb-2"
                >
                  <v-avatar :color="color" size="36"></v-avatar>
                </v-col>
              </v-row>
            </v-col>

            <!-- 캐릭터 이미지 -->
            <v-img
              :src="character.character_image"
              alt="Character Image"
              contain
              max-height="200"
            ></v-img>

            <!-- 서브 컬러 표시 -->
            <v-col cols="3">
              <h3 class="text-center">서브컬러</h3>
              <v-row>
                <v-col
                  v-for="(color, index) in character.sub_colors"
                  :key="'sub-color-' + index"
                  class="d-flex justify-center mb-2"
                >
                  <v-avatar :color="color" size="36"></v-avatar>
                </v-col>
              </v-row>
            </v-col>
          </v-card-text>
        </v-card>

        <!-- 색상 선택 카드 -->
        <v-card class="pa-4 mb-4 elevation-2 modern-card">
          <v-card-title class="headline">외형 커스터마이징</v-card-title>
          <v-row>
            <v-col cols="8">
              <v-color-picker
                v-model="selectedColor"
                flat
                hide-canvas
                @input="resetHSB"
              ></v-color-picker>
              <v-btn color="primary" @click="addColorToList" class="mt-3">
                색상 추가
              </v-btn>
            </v-col>
            <v-col cols="4">
              <div class="color-box">
                <div
                  v-for="(color, index) in colorList"
                  :key="index"
                  class="color-swatch"
                  :style="{ backgroundColor: color }"
                ></div>
                <v-btn icon @click="clearColorList" class="clear-button">
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>

          <!-- 색조, 채도, 명도 조절 슬라이더와 버튼 -->
          <v-row class="mt-4">
            <!-- 색조 -->
            <v-col cols="8">
              <v-slider
                v-model="hue"
                label="색조"
                min="0"
                max="360"
                class="mt-2"
                @input="updateColor"
              ></v-slider>
            </v-col>
            <v-col cols="2">
              <span>{{ Math.round(hue) }}</span>
            </v-col>
            <v-col cols="2" class="d-flex align-center">
              <v-btn small @click="adjustHue(-1)">-</v-btn>
              <v-btn small @click="adjustHue(1)">+</v-btn>
            </v-col>

            <!-- 채도 -->
            <v-col cols="8">
              <v-slider
                v-model="saturation"
                label="채도"
                min="-99"
                max="99"
                class="mt-2"
                @input="updateColor"
              ></v-slider>
            </v-col>
            <v-col cols="2">
              <span>{{ Math.round(saturation) }}</span>
            </v-col>
            <v-col cols="2" class="d-flex align-center">
              <v-btn small @click="adjustSaturation(-1)">-</v-btn>
              <v-btn small @click="adjustSaturation(1)">+</v-btn>
            </v-col>

            <!-- 명도 -->
            <v-col cols="8">
              <v-slider
                v-model="brightness"
                label="명도"
                min="-99"
                max="99"
                class="mt-2"
                @input="updateColor"
              ></v-slider>
            </v-col>
            <v-col cols="2">
              <span>{{ Math.round(brightness) }}</span>
            </v-col>
            <v-col cols="2" class="d-flex align-center">
              <v-btn small @click="adjustBrightness(-1)">-</v-btn>
              <v-btn small @click="adjustBrightness(1)">+</v-btn>
            </v-col>
          </v-row>

          <!-- 계산된 색상 미리보기 -->
          <div
            class="computed-color-preview mt-4"
            :style="{ backgroundColor: computedColor }"
          >
            <p class="text-center">미리보기</p>
          </div>
        </v-card>

        <!-- 오류 메시지 표시 -->
        <v-alert v-if="message" type="error" outlined class="mt-4">
          {{ message }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "CharacterInfo",
  data() {
    return {
      characterName: "",
      character: {},
      message: "",
      selectedColor: "#ffffff",
      colorList: [],
      hue: 0,
      saturation: 0,
      brightness: 0
    };
  },
  computed: {
    computedColor() {
      const hsl = this.hexToHSL(this.selectedColor);
      hsl.h = (hsl.h + this.hue) % 360;
      hsl.s = Math.min(100, Math.max(0, hsl.s + this.saturation));
      hsl.l = Math.min(100, Math.max(0, hsl.l + this.brightness));
      return this.hslToHex(hsl.h, hsl.s, hsl.l);
    }
  },
  methods: {
    async searchAndSaveCharacter() {
      if (!this.characterName) return; // 캐릭터 이름이 없으면 중단
      try {
        const ocidResponse = await axios.get(
          `http://localhost:8081/api/characters/ocid`,
          { params: { name: this.characterName } }
        );
        this.character = ocidResponse.data;
        this.message = "";
      } catch (error) {
        console.error("캐릭터 정보를 불러오는 중 오류가 발생했습니다:", error);
        this.message = "캐릭터 정보를 불러오는 중 오류가 발생했습니다.";
      }
    },
    addColorToList() {
      if (this.selectedColor && !this.colorList.includes(this.selectedColor)) {
        this.colorList.push(this.selectedColor);
      }
    },
    clearColorList() {
      this.colorList = [];
    },
    adjustHue(amount) {
      this.hue = Math.min(360, Math.max(0, this.hue + amount));
    },
    adjustSaturation(amount) {
      this.saturation = Math.min(99, Math.max(-99, this.saturation + amount));
    },
    adjustBrightness(amount) {
      this.brightness = Math.min(99, Math.max(-99, this.brightness + amount));
    },
    resetHSB() {
      this.hue = 0;
      this.saturation = 0;
      this.brightness = 0;
      this.updateColor();
    },
    updateColor() {
      this.computedColor;
    },
    hexToHSL(hex) {
      let r = 0, g = 0, b = 0;
      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
      }
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    },
    hslToHex(h, s, l) {
      s /= 100;
      l /= 100;
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;
      let r = 0, g = 0, b = 0;
      if (0 <= h && h < 60) { r = c; g = x; b = 0; }
      else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
      else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
      else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
      else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
      else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
      r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
      g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
      b = Math.round((b + m) * 255).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
  },
  watch: {
    // 라우터의 query 파라미터가 변경될 때마다 searchAndSaveCharacter 호출
    "$route.query.q"(newQuery) {
      this.characterName = newQuery;
      this.searchAndSaveCharacter();
    }
  },
  created() {
    // 컴포넌트가 생성될 때 URL에서 캐릭터 이름을 가져와 검색
    this.characterName = this.$route.query.q || "";
    if (this.characterName) {
      this.searchAndSaveCharacter();
    }
  }
};
</script>

<style scoped>
.modern-title {
  color: #2c3e50;
  font-weight: bold;
  font-size: 1.5em;
}
.modern-card {
  background-color: #f9f9f9;
  color: #2c3e50;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
.color-box {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  min-height: 100px;
  background-color: #fff;
  position: relative;
}
.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ddd;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
}
.clear-button {
  position: absolute;
  top: 5px;
  right: 5px;
}
.computed-color-preview {
  width: 100%;
  height: 50px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
