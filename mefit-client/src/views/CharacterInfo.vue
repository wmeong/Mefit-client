<template>
  <v-container class="main-container" fluid>
    <!-- 캐릭터 이미지와 기본 정보 정렬 -->
    <v-row class="align-start" dense>
      <v-col cols="12" md="4">
        <!-- 테두리를 포함하는 wrapper -->
        <div class="avatar-container">
          <!-- 캐릭터 이미지 -->
          <v-img
            :src="
              characterInfo.character_image || 'https://via.placeholder.com/150'
            "
            alt="Character Image"
            class="character-image"
            :style="{
              transform: `scale(${scale})`,
              transition: 'transform 0.3s ease-in-out',
            }"
          ></v-img>
          <!-- 버튼 그룹 -->
          <div class="button-group">
            <!-- 확대/축소 버튼 -->
            <v-btn @click="toggleZoom" class="modern-btn" elevation="2">
              <v-icon size="24">{{
                scale === 0.7
                  ? "mdi-magnify-plus-outline"
                  : "mdi-magnify-minus-outline"
              }}</v-icon>
            </v-btn>

            <!-- 다운로드 버튼 -->
            <v-btn @click="downloadImage" class="modern-btn" elevation="2">
              <v-icon size="24">mdi-download</v-icon>
            </v-btn>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="8">
        <!-- 기본 정보 및 퍼스널 컬러 분석 결과 -->
        <v-card class="pa-4 elevation-2 modern-card">
          <v-card-title class="headline text-center">{{
            characterInfo.character_name || "캐릭터 이름"
          }}</v-card-title>
          <v-card-subtitle class="text-left">
            <span>
              {{ characterInfo.character_level || "레벨" }}
              {{ characterInfo.character_gender || "성별" }}
            </span>
            <br />
            <span>
              <img
                v-if="characterInfo.world_name"
                :src="getWorldIcon(characterInfo.world_name)"
                alt="world-icon"
                class="world-icon"
              />
              {{ characterInfo.world_name || "월드명" }}
              {{ characterInfo.character_class || "직업" }}
              {{ characterInfo.character_guild_name || "길드명" }}
            </span>
          </v-card-subtitle>
          <!-- 퍼스널 컬러 분석 결과 -->
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
          <!-- 메인컬러 -->
          <v-row class="align-center mb-4 pt-4">
            <v-col cols="3" class="text-left">
              <h4 class="text-left">메인컬러</h4>
            </v-col>
            <v-col cols="9" class="d-flex">
              <v-avatar
                v-for="(color, index) in characterInfo.main_colors || [
                  '#ccc',
                  '#ddd',
                ]"
                :key="'main-color-' + index"
                :color="color"
                size="44"
                class="mr-12"
              ></v-avatar>
            </v-col>
          </v-row>

          <!-- 서브컬러 -->
          <v-row class="align-cente">
            <v-col cols="3" class="text-left">
              <h4 class="text-left">서브컬러</h4>
            </v-col>
            <v-col cols="9" class="d-flex">
              <v-avatar
                v-for="(color, index) in characterInfo.sub_colors || [
                  '#eee',
                  '#fff',
                ]"
                :key="'sub-color-' + index"
                :color="color"
                size="44"
                class="mr-12"
              ></v-avatar>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- 캐시 장비 정보 -->
    <v-row class="mt-4" dense>
      <v-col
        v-for="item in filteredItems"
        :key="item.type"
        cols="12"
        sm="6"
        md="4"
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
              계열: {{ item.colorRange }}
              <br />
              색:
              {{ item.colorHue }} 채: {{ item.colorSaturation }} 명:
              {{ item.colorValue }}
            </p>
            <p class="equipment-subdetails" v-else-if="item.mixColor">
              {{ item.baseColor }} : {{ item.baseColorRate }}
              <br />
              {{ item.mixColor }} :
              {{ item.mixColorRate }}
            </p>
            <p class="equipment-subdetails" v-else-if="item.colorStyle">
              계열: {{ item.colorStyle }}
              <br />
              색:
              {{ item.skinHue }} 채: {{ item.skinSaturation }} 명:
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
  // 🌸 봄 웜톤 (Spring Warm Tone)
  {
    name: "봄웜 라이트",
    hues: [15, 45],
    saturationRange: [70, 100],
    valueRange: [80, 100],
  },
  {
    name: "봄웜 브라이트",
    hues: [10, 40],
    saturationRange: [80, 100],
    valueRange: [70, 100],
  },
  {
    name: "봄웜 트루",
    hues: [10, 40],
    saturationRange: [60, 90],
    valueRange: [60, 90],
  },

  // ❄️ 여름 쿨톤 (Summer Cool Tone)
  {
    name: "여름쿨 라이트",
    hues: [170, 210],
    saturationRange: [30, 60],
    valueRange: [70, 90],
  },
  {
    name: "여름쿨 브라이트",
    hues: [160, 200],
    saturationRange: [60, 80],
    valueRange: [70, 90],
  },
  {
    name: "여름쿨 뮤트",
    hues: [150, 190],
    saturationRange: [20, 40],
    valueRange: [50, 70],
  },

  // 🍂 가을 웜톤 (Autumn Warm Tone)
  {
    name: "가을웜 뮤트",
    hues: [25, 40],
    saturationRange: [30, 60],
    valueRange: [50, 70],
  },
  {
    name: "가을웜 스트롱",
    hues: [10, 30],
    saturationRange: [50, 80],
    valueRange: [40, 70],
  },
  {
    name: "가을웜 딥",
    hues: [0, 20],
    saturationRange: [50, 80],
    valueRange: [30, 60],
  },

  // 🌌 겨울 쿨톤 (Winter Cool Tone)
  {
    name: "겨울쿨 브라이트",
    hues: [220, 260],
    saturationRange: [60, 100],
    valueRange: [70, 100],
  },
  {
    name: "겨울쿨 스트롱",
    hues: [200, 240],
    saturationRange: [50, 80],
    valueRange: [40, 70],
  },
  {
    name: "겨울쿨 다크",
    hues: [180, 220],
    saturationRange: [30, 60],
    valueRange: [30, 60],
  },
];

export default {
  name: "CharacterInfo",
  data() {
    return {
      scale: 0.7, // 초기 확대 배율
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
    // 월드명 매핑 객체
    getWorldIcon(worldName) {
      const worldNameMap = {
        아케인: "arcane",
        오로라: "aurora",
        베라: "bera",
        크로아: "croa",
        엘리시움: "elysium",
        에노시스: "enosis",
        에오스: "eos",
        헬리오스: "helios",
        루나: "luna",
        노바: "nova",
        레드: "red",
        스카니아: "scania",
        유니온: "union",
        제니스: "zenith",
      };
      const fileName = worldNameMap[worldName] || "default";
      return require(`@/assets/world/${fileName}.png`);
    },
    /**
     * 캐릭터 이미지를 확대/축소하는 메서드
     */
    /**
     * 확대/축소 토글
     */
    toggleZoom() {
      this.scale = this.scale === 1.0 ? 0.7 : 1.0; 
    },
    async downloadImage() {
      try {
        const response = await fetch(this.characterInfo.character_image);
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "character_image.png"; // 다운로드 파일 이름
        link.click();
        URL.revokeObjectURL(link.href); // 메모리 해제
      } catch (error) {
        console.error("이미지 다운로드 중 오류가 발생했습니다:", error);
      }
    },
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
        console.log(
          "1,2,3위 : " +
            this.characterInfo.main_colors +
            " 4,5,6위 : " +
            this.characterInfo.sub_colors
        );
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

      // 가중치 설정
      const weights = [0.25, 0.2, 0.15, 0.15, 0.15, 0.05];

      let totalH = 0,
        totalS = 0,
        totalV = 0;
      let totalWeight = 0;

      // 1위부터 6위까지 순회하면서 HSV 값 계산
      const colors = [
        ...(this.characterInfo.main_colors || []),
        ...(this.characterInfo.sub_colors || []),
      ];
      colors.forEach((color, index) => {
        if (index >= weights.length) return; // 최대 6개까지만 처리

        const [r, g, b] = this.hexToRgb(color);
        const { h, s, v } = this.rgbToHsv(r, g, b);

        const weight = weights[index];
        totalH += h * weight;
        totalS += s * weight;
        totalV += v * weight;
        totalWeight += weight;
      });

      // 최종 평균 HSV 계산
      const avgH = Math.round(totalH / totalWeight);
      const avgS = Math.round(totalS / totalWeight);
      const avgV = Math.round(totalV / totalWeight);

      return this.matchPersonalColor(avgH, avgS, avgV);
    },

    //css와 매핑
    personalColorGroup() {
      const group = PERSONAL_COLOR_GROUPS.find((colorGroup) =>
        this.personalColorAnalysis.includes(colorGroup.name)
      );
      if (!group) return "";
      // 한글 name을 영어로 변환하여 CSS 클래스 이름으로 사용
      if (group.name.includes("봄웜")) return "Spring";
      if (group.name.includes("여름쿨")) return "Summer";
      if (group.name.includes("가을웜")) return "Autumn";
      if (group.name.includes("겨울쿨")) return "Winter";
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
.character-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 16px;
  flex-direction: column;
}
.character-image {
  max-height: 250px; /* 초기 높이를 줄임 */
  max-width: auto; /* 너비를 높이에 비례해 자동 조정 */
  object-fit: contain; /* 이미지 비율 유지 */
  display: block;
  margin: 0 auto;
}
.modern-card {
  background-color: #ffffff;
  color: #2c3e50;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 12px;
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
.equipment-details {
  flex-grow: 1;
  text-align: left;
  line-height: 1.5;
}
.equipment-name {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
}
.equipment-subdetails {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}
.personal-color-result {
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
}
.personal-color-result.Spring {
  background-color: #fbe7c6;
  color: #8d5524;
}
.personal-color-result.Summer {
  background-color: #e6f7ff;
  color: #007acc;
}
.personal-color-result.Autumn {
  background-color: #fdecc8;
  color: #a64b2a;
}
.personal-color-result.Winter {
  background-color: #f0f4f7;
  color: #3a4e80;
}
.world-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  vertical-align: middle;
}
.character-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.character-image {
  max-height: 280px; /* 이미지 최대 높이 */
  width: auto;
  display: block;
  margin: 0 auto; /* 이미지 가운데 정렬 */
}
.button-row {
  margin-top: 16px; /* 버튼과 이미지 간격 */
  display: flex;
  justify-content: center; /* 버튼을 가운데 정렬 */
  gap: 16px; /* 버튼 간격 */
}
.button-row v-btn {
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1); /* 버튼 그림자 */
}
.zoom-button-container {
  margin-top: 55px; /* 이미지와 버튼 사이 간격을 더 넓게 */
  text-align: center;
}
.button-group {
  position: absolute;
  bottom: 16px; /* 컨테이너 하단에서 여백 */
  right: 16px; /* 컨테이너 오른쪽에서 여백 */
  display: flex;
  gap: 8px; /* 버튼 간 간격 */
  z-index: 10; /* 이미지 위에 위치 */
}
.button-group v-btn {
  width: 40px; /* 버튼 크기 */
  height: 40px;
  border-radius: 50%; /* 원형 버튼 */
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}
.character-image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  overflow: visible; /* 'hidden' 대신 'visible'로 수정 */
  position: relative;
}
.avatar-container {
  position: relative;
  width: 240px;
  height: 320px;
  margin: 0 auto;
  border: 2px solid #ddd;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* 불필요한 요소가 넘어가지 않도록 */
}

</style>
