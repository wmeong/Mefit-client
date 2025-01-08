<template>
  <v-container class="main-container">
    <!-- 검색 섹션 -->
    <v-row class="align-center justify-center">
      <v-col cols="12" md="8" lg="6">
        <h1 class="text-center modern-title mb-5">검색</h1>

        <v-text-field
          v-model="characterName"
          label="캐릭터 이름 입력"
          outlined
          hide-details
          class="mb-4"
          @keyup.enter="searchAndSaveCharacter"
        ></v-text-field>

        <v-btn
          style="
            background-color: #f4f4f4;
            box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
            color: #333;
          "
          outlined
          @click="searchAndSaveCharacter"
          class="mb-4 rounded-button"
          block
        >
          검색 및 저장
        </v-btn>
      </v-col>
    </v-row>

    <!-- 캐릭터 정보 카드 -->
    <v-row>
      <!-- 캐릭터 이미지 영역 -->
      <v-col cols="12" md="5" class="d-flex flex-column align-center">
        <v-img
          :src="
            characterInfo.character_image || 'https://via.placeholder.com/150'
          "
          alt="Character Image"
          max-height="250"
          width="auto"
          class="character-image"
        ></v-img>

        <!-- 캐릭터 기본 정보 카드 -->
        <v-card class="mt-4 pa-4 elevation-2 modern-card">
          <v-card-title class="headline text-center">{{
            characterInfo.character_name || "캐릭터 이름"
          }}</v-card-title>
          <v-card-subtitle class="text-center">
            <p>
              <strong>월드:</strong> {{ characterInfo.world_name || "월드명" }}
            </p>
            <p>
              <strong>성별:</strong>
              {{ characterInfo.character_gender || "성별" }}
            </p>
            <p>
              <strong>직업:</strong>
              {{ characterInfo.character_class || "직업" }}
            </p>
            <p>
              <strong>레벨:</strong>
              {{ characterInfo.character_level || "레벨" }}
            </p>
            <p>
              <strong>길드:</strong>
              {{ characterInfo.character_guild_name || "길드명" }}
            </p>
          </v-card-subtitle>
        </v-card>
      </v-col>

      <!-- 퍼스널 컬러 분석 결과 -->
      <v-col cols="12" md="7">
        <v-card class="pa-4 elevation-2 modern-card">
          <h3 class="text-center mb-4">퍼스널 컬러 분석 결과</h3>
          <h2
            :class="[
              'text-center',
              'personal-color-result',
              personalColorGroup,
            ]"
          >
            {{ personalColorAnalysis }}
          </h2>

          <!-- 메인 컬러 표시 -->
          <h4 class="text-center">메인컬러</h4>
          <v-row class="mb-4">
            <v-col
              v-for="(color, index) in characterInfo.main_colors || [
                '#ccc',
                '#ddd',
              ]"
              :key="'main-color-' + index"
              class="d-flex justify-center mb-2"
            >
              <v-avatar :color="color" size="36"></v-avatar>
            </v-col>
          </v-row>

          <!-- 서브 컬러 표시 -->
          <h4 class="text-center">서브컬러</h4>
          <v-row>
            <v-col
              v-for="(color, index) in characterInfo.sub_colors || [
                '#eee',
                '#fff',
              ]"
              :key="'sub-color-' + index"
              class="d-flex justify-center mb-2"
            >
              <v-avatar :color="color" size="36"></v-avatar>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- 캐시 장비 정보 -->
    <v-row class="mt-5">
      <v-col
        v-for="item in filteredItems"
        :key="item.type"
        cols="4"
        class="equipment-item"
      >
        <div class="d-flex align-start">
          <!-- 아이콘 -->
          <div>
            <img :src="item.icon" :alt="item.type" class="equipment-icon" />
          </div>

          <!-- 캐시 장비 정보 -->
          <div class="equipment-details">
            <span class="equipment-name">{{ item.name }}</span>

            <p class="equipment-subdetails" v-if="item.colorRange">
              계열: {{ item.colorRange }}<br />
              색: {{ item.colorHue }} 채: {{ item.colorSaturation }} 명:
              {{ item.colorValue }}
            </p>
            <p class="equipment-subdetails" v-else-if="item.mixColor">
              {{ item.baseColor }} : {{ item.baseColorRate }} <br />
              {{ item.mixColor }} : {{ item.mixColorRate }}
            </p>
            <p class="equipment-subdetails" v-else-if="item.colorStyle">
              계열: {{ item.colorStyle }}<br />
              색: {{ item.skinHue }} 채: {{ item.skinSaturation }} 명:
              {{ item.skinBrightness }}
            </p>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
const PERSONAL_COLOR_GROUPS = [
  {
    name: "Spring Light",
    hues: [15, 45],
    saturationRange: [70, 100],
    valueRange: [80, 100],
  },
  {
    name: "Spring True",
    hues: [10, 40],
    saturationRange: [60, 90],
    valueRange: [60, 90],
  },
  {
    name: "Spring Bright",
    hues: [20, 50],
    saturationRange: [80, 100],
    valueRange: [70, 100],
  },
  {
    name: "Summer Light",
    hues: [170, 210],
    saturationRange: [30, 60],
    valueRange: [70, 90],
  },
  {
    name: "Summer True",
    hues: [160, 200],
    saturationRange: [20, 50],
    valueRange: [60, 80],
  },
  {
    name: "Summer Soft",
    hues: [150, 190],
    saturationRange: [20, 40],
    valueRange: [50, 70],
  },
  {
    name: "Autumn Soft",
    hues: [25, 40],
    saturationRange: [30, 60],
    valueRange: [50, 70],
  },
  {
    name: "Autumn True",
    hues: [10, 30],
    saturationRange: [40, 70],
    valueRange: [50, 80],
  },
  {
    name: "Autumn Deep",
    hues: [0, 20],
    saturationRange: [50, 80],
    valueRange: [40, 70],
  },
  {
    name: "Winter Deep",
    hues: [220, 260],
    saturationRange: [50, 100],
    valueRange: [40, 70],
  },
  {
    name: "Winter True",
    hues: [200, 240],
    saturationRange: [30, 60],
    valueRange: [50, 80],
  },
  {
    name: "Winter Bright",
    hues: [240, 280],
    saturationRange: [60, 100],
    valueRange: [70, 100],
  },
];

export default {
  name: "CharacterInfo",
  data() {
    return {
      characterName: "", // 검색어
      characterInfo: {}, // 캐릭터 정보 데이터
      message: "", // 오류 메시지
      characterCashItem: [],
      characterCashFace: [],
      REQUIRED_ITEM_TYPES: [
        { type: "헤어", icon: require("@/assets/hair.png"), name: "" },
        { type: "성형", icon: require("@/assets/face.png"), name: "" },
        { type: "피부", icon: require("@/assets/skin.png"), name: "" },
        { type: "모자", icon: "", name: "" },
        { type: "얼장", icon: "", name: "" },
        { type: "눈장", icon: "", name: "" },
        { type: "귀걸", icon: "", name: "" },
        { type: "상의", icon: "", name: "" },
        { type: "하의", icon: "", name: "" },
        { type: "신발", icon: "", name: "" },
        { type: "장갑", icon: "", name: "" },
        { type: "망토", icon: "", name: "" },
        { type: "무기", icon: "", name: "" },
      ],
    };
  },
  methods: {
    /**
     * 캐릭터 정보를 API에서 검색 및 저장
     */
    async searchAndSaveCharacter() {
      if (!this.characterName) return; // 캐릭터 이름이 없으면 중단
      try {
        const ocidResponse = await axios.get(
          `http://localhost:8081/api/characters/ocid`,
          { params: { name: this.characterName } }
        );
        this.characterInfo = ocidResponse.data.characterInfoDTO;
        console.log("Character Image URL:", this.characterInfo.character_image);
        this.characterCashItem = ocidResponse.data.searchedCashItemDTOS;
        this.characterCashFace = ocidResponse.data.searchedCashFaceDTOS;
        console.log("item", this.characterCashItem);
        console.log("face", this.characterCashFace);
        this.message = "";
      } catch (error) {
        console.error("캐릭터 정보를 불러오는 중 오류가 발생했습니다:", error);
        this.message = "캐릭터 정보를 불러오는 중 오류가 발생했습니다.";
      }
    },
    hexToRgb(hex) {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return [r, g, b];
    },
    rgbToHsv(r, g, b) {
      (r /= 255), (g /= 255), (b /= 255);
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      let h,
        s,
        v = max;

      const d = max - min;
      s = max === 0 ? 0 : d / max;

      if (max === min) {
        h = 0; // achromatic
      } else {
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

      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100),
      };
    },
    matchPersonalColor(hue, saturation, value) {
      let closestMatch = "Unknown";
      let closestDistance = Infinity;

      for (const group of PERSONAL_COLOR_GROUPS) {
        const [minHue, maxHue] = group.hues;
        const [minSaturation, maxSaturation] = group.saturationRange;
        const [minValue, maxValue] = group.valueRange;

        // Calculate the center point of each range
        const avgHue = (minHue + maxHue) / 2;
        const avgSaturation = (minSaturation + maxSaturation) / 2;
        const avgValue = (minValue + maxValue) / 2;

        // Calculate the distance between the input color and the center point
        const distance = Math.sqrt(
          Math.pow(hue - avgHue, 2) +
            Math.pow(saturation - avgSaturation, 2) +
            Math.pow(value - avgValue, 2)
        );

        // Find the closest match
        if (distance < closestDistance) {
          closestDistance = distance;
          closestMatch = group.name;
        }
      }

      return closestMatch;
    },
  },
  created() {
    // 라우터의 쿼리에서 캐릭터 이름 가져오기
    this.characterName = this.$route.query.q || "";
    if (this.characterName) {
      // 캐릭터 이름이 있을 경우 API 호출
      this.searchAndSaveCharacter();
    }
  },
  computed: {
    filteredItems() {
      return this.REQUIRED_ITEM_TYPES.map((requiredItemType) => {
        // 캐릭터의 캐시 아이템 데이터에서 item_type이 requiredItemType.type과 일치하는 데이터를 찾는다.
        const cashItemData = this.characterCashItem.find(
          (itemData) => itemData.item_type === requiredItemType.type
        );

        const cashFaceData = this.characterCashFace.find(
          (itemData) => itemData.item_type === requiredItemType.type
        );

        // 아이템 데이터가 있으면 세부 정보를 추가
        if (cashItemData && cashItemData.item_name) {
          return {
            type: requiredItemType.type,
            icon: cashItemData.item_icon || "https://via.placeholder.com/50",
            name: cashItemData.item_name,
            colorRange: cashItemData.color_range || null, // null로 유지
            colorHue: cashItemData.color_hue || 0,
            colorSaturation: cashItemData.color_saturation || 0,
            colorValue: cashItemData.color_value || 0,
          };
        }

        if (cashFaceData && cashFaceData.item_name) {
          return {
            type: requiredItemType.type,
            icon: requiredItemType.icon,
            name: cashFaceData.item_name,
            baseColor: cashFaceData.base_color,
            baseColorRate: 100 - cashFaceData.mix_rate + "%",
            mixColor: cashFaceData.mix_color,
            mixColorRate: cashFaceData.mix_rate + "%",
            colorStyle: cashFaceData.color_style || null, // null로 유지
            skinHue: cashFaceData.skin_hue || 0,
            skinSaturation: cashFaceData.skin_saturation || 0,
            skinBrightness: cashFaceData.skin_brightness || 0,
          };
        }

        // 기본값 반환
        if (requiredItemType.name) {
          return {
            type: requiredItemType.type,
            icon: requiredItemType.icon || "https://via.placeholder.com/50",
            name: requiredItemType.name,
          };
        }

        return null; // 아이템이 없으면 null
      }).filter((item) => item !== null);
    },

    personalColorAnalysis() {
      if (
        !this.characterInfo.main_colors ||
        this.characterInfo.main_colors.length === 0
      ) {
        return "Unknown";
      }

      // Average the main colors to get a single representative color
      let totalH = 0,
        totalS = 0,
        totalV = 0;
      this.characterInfo.main_colors.forEach((color) => {
        const [r, g, b] = this.hexToRgb(color);
        const { h, s, v } = this.rgbToHsv(r, g, b);
        totalH += h;
        totalS += s;
        totalV += v;
      });

      const avgH = Math.round(totalH / this.characterInfo.main_colors.length);
      const avgS = Math.round(totalS / this.characterInfo.main_colors.length);
      const avgV = Math.round(totalV / this.characterInfo.main_colors.length);

      return this.matchPersonalColor(avgH, avgS, avgV);
    },

    personalColorGroup() {
      if (this.personalColorAnalysis.includes("Spring")) {
        return "Spring";
      } else if (this.personalColorAnalysis.includes("Summer")) {
        return "Summer";
      } else if (this.personalColorAnalysis.includes("Autumn")) {
        return "Autumn";
      } else if (this.personalColorAnalysis.includes("Winter")) {
        return "Winter";
      }
      return "";
    },
  },
};
</script>
<style scoped>
.main-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 기존 제목 스타일 */
.modern-title {
  color: #2c3e50;
  font-weight: bold;
  font-size: 1.5em;
}

/* 기존 카드 스타일 */
.modern-card {
  background-color: #ffffff;
  color: #2c3e50;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
/* 아이템 박스 스타일 */
.equipment-item {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  background-color: #ffffff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  min-height: 100px;
  transition: border 0.3s ease, box-shadow 0.3s ease;
}

/* 호버 효과 */
.equipment-item:hover {
  border: 1px solid #ff88aa; /* hover 시 테두리를 진하게 */
  box-shadow: 0px 4px 10px rgba(255, 136, 170, 0.3); /* hover 시 그림자 */
}

/* 아이콘 이미지 스타일 */
.equipment-icon {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  margin-right: 12px;
  object-fit: contain;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  padding: 6px;
  background-color: #f9f9f9;
}

/* 텍스트 부분 스타일 */
.equipment-details {
  flex-grow: 1;
  text-align: left;
  line-height: 1.5;
}

/* 아이템 이름 스타일 */
.equipment-name {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
}

/* 세부 정보 텍스트 스타일 */
.equipment-subdetails {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

/* 아이템 ID 텍스트 스타일 */
.equipment-id {
  font-size: 10px;
  color: #999;
  margin-top: 5px;
}

.text-personal-color {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.modern-card {
  background-color: #ffffff;
  color: #2c3e50;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.equipment-item {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  background-color: #ffffff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  min-height: 100px;
  transition: border 0.3s ease, box-shadow 0.3s ease;
}

.equipment-item:hover {
  border: 1px solid #ff88aa;
  box-shadow: 0px 4px 10px rgba(255, 136, 170, 0.3);
}

.equipment-icon {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  margin-right: 12px;
  object-fit: contain;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  padding: 6px;
  background-color: #f9f9f9;
}

.character-image {
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

.personal-color-result {
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
}

/* Spring 그룹 스타일 */
.personal-color-result.Spring {
  background-color: #fbe7c6; /* 부드러운 베이지 색 */
  color: #8d5524; /* 따뜻한 브라운 텍스트 */
}

/* Summer 그룹 스타일 */
.personal-color-result.Summer {
  background-color: #e6f7ff; /* 밝은 하늘색 */
  color: #007acc; /* 시원한 블루 텍스트 */
}

/* Autumn 그룹 스타일 */
.personal-color-result.Autumn {
  background-color: #fdecc8; /* 부드러운 크림 색 */
  color: #a64b2a; /* 짙은 오렌지 텍스트 */
}

/* Winter 그룹 스타일 */
.personal-color-result.Winter {
  background-color: #f0f4f7; /* 밝은 회색 톤 */
  color: #3a4e80; /* 딥 블루 텍스트 */
}
</style>
