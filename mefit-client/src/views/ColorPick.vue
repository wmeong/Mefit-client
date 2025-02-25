<template>
  <v-container class="py-10 main-container">
    <!-- 0번: 컬러픽 타이틀 영역 -->
    <v-row justify="center" class="mb-6">
      <div class="color-pick-banner">
        <div class="color-pick-background">
          <h1 class="color-pick-title">Color Pick</h1>
        </div>
      </div>
    </v-row>

    <!-- 검색 영역 -->
    <div class="search-bar-container">
      <!-- 검색창 -->
      <input
        type="text"
        placeholder="닉네임을 입력하세요"
        :value="characterName"
        class="search-input"
        @input="updateCharacterName"
        @keydown.enter.prevent="searchCharacter"
      />
      <button @click="searchCharacter" class="search-button">
        <img src="@/assets/search2.webp" alt="검색" class="search-icon" /> 검색</button>
    </div>

    <!-- 1번: 퍼스널컬러 정보 영역 -->

    <v-card v-if="characterInfo.characterImage" class="personal-card mb-6">
      <div
        class="personal-color-result"
        :class="personalColorGroup"
        :style="{ backgroundColor: colorForBackground }"
      >
        {{ characterInfo.personalColor }}
        <v-btn
          icon
          color="grey darken-2"
          class="help-btn ml-2 mb-1"
          style="width: 20px; height: 20px"
        >
          <v-tooltip bottom>
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                style="font-size: 16px; cursor: pointer; line-height: 1"
              >
                mdi-help-circle-outline
              </v-icon>
            </template>
            <span>
              퍼스널컬러 분석은 캐릭터 색상을
              <br />
              기반으로 제공됩니다.
              <br />
              기술적 처리 방식과 이미지의 특성상
              <br />
              일부 색상 정보가 왜곡될 수 있으며,
              <br />
              화면 환경에 따라 차이가 발생할 수 있습니다.
              <br />
              분석 결과는 참고용으로 활용해 주세요.
            </span>
          </v-tooltip>
        </v-btn>
      </div>

      <v-row class="align-center main-sub-color-row">
        <!-- 메인컬러 왼쪽 정렬 -->
        <v-col cols="6" class="main-color-area d-flex align-center">
          <h4 class="color-label" :style="colorLabelStyle">main color</h4>
          <div class="color-preview">
            <v-avatar
              v-for="(color, index) in characterInfo.mainColors"
              :key="'main-color-' + index"
              :color="color"
              size="40"
              class="mr-2"
            ></v-avatar>
          </div>
        </v-col>

        <!-- 서브컬러 오른쪽 정렬 -->
        <v-col cols="6" class="sub-color-area d-flex align-center justify-end">
          <h4 class="color-label" :style="colorLabelStyle">sub color</h4>
          <div class="color-preview">
            <v-avatar
              v-for="(color, index) in characterInfo.subColors"
              :key="'sub-color-' + index"
              :color="color"
              size="40"
              class="ml-2"
            ></v-avatar>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <v-row>
      <!-- 2번: 캐릭터 이미지 영역 -->
      <v-col cols="10" md="8" class="d-flex flex-column">
        <v-card class="character-card mb-4">
          <img
            v-if="characterInfo.characterImage"
            :src="characterInfo.characterImage"
            alt="Character Image"
            class="character-image"
            :style="{
              transform: `scale(${scale})`,
              transition: 'transform 0.3s ease-in-out',
            }"
          />
          <img
            v-else
            src="@/assets/avatar.webp"
            alt="Default Image"
            class="character-image"
            :style="{
              transform: `scale(${scale})`,
              transition: 'transform 0.3s ease-in-out',
            }"
          />
          <v-btn
            @click="toggleZoom"
            class="toggle-btn"
            elevation="2"
            style="width: 40px; padding: 0; min-width: 40px"
          >
            <v-icon size="20">
              {{
                scale < 1.8
                  ? "mdi-magnify-plus-outline"
                  : "mdi-magnify-minus-outline"
              }}
            </v-icon>
          </v-btn>
        </v-card>
      </v-col>

      <!-- 3번: 컬러피커 영역 -->
      <v-col cols="10" md="4" class="d-flex flex-column">
        <v-card class="picker-card mb-4">
          <v-color-picker
            v-model="selectedColor"
            flat
            class="custom-picker"
          ></v-color-picker>
        </v-card>
      </v-col>
    </v-row>

        <!-- 4번 컬러 저장 영역 -->
        <v-btn class="fixed-add-btn" @click="addColor" :disabled="!selectedColor">
            <img src="@/assets/heart.webp" alt="Heart Icon" class="heart-icon" /> 색상 추가
             <img src="@/assets/heart.webp" alt="Heart Icon" class="heart-icon" />
        </v-btn>

    <v-card class="picker-saved-colors-box">
      <!-- 새로고침 버튼 추가 -->
      <v-btn icon @click="resetSavedColors" class="refresh-btn" elevation="2">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-row dense justify="center" class="mt-4 picker-saved-color-grid">
        <template v-if="savedColors.length === 0">
          <img
            src="@/assets/colorpick.gif"
            alt="기본 이미지"
            class="default-saved-color-image"
            :style="{
              width: '200px',
              objectFit: 'contain',
            }"
          />
        </template>
        <template v-else>
          <v-col
            v-for="(color, index) in savedColors"
            :key="index"
            cols="1.5"
            class="pa-1"
          >
            <v-card
              :style="{ backgroundColor: color }"
              class="picker-color-result"
              outlined
            >
              <div class="picker-color-info">{{ color }}</div>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-card>
    <!-- 공통 알림 팝업 추가 -->
    <CustomAlert
      v-if="showAlert"
      :visible="showAlert"
      title="알림"
      message="존재하지 않는 캐릭터입니다."
      @close="showAlert = false"
    />
  </v-container>
</template>

<script>
import axios from "axios";
import CustomAlert from "@/components/CustomAlert.vue"; // 공통 알림 컴포넌트
import colorAnalysisMixin from "@/mixins/colorAnalysisMixin"; //컬러 분석 믹스인

export default {
  components: { CustomAlert },
  mixins: [colorAnalysisMixin],
  data() {
    return {
      characterInfo: {
        characterImage: "",
        personalColor: "",
        mainColors: [],
        subColors: [],
      },
      selectedColor: "#ffffff",
      savedColors: [],
      characterName: "", // 검색어
      scale: 0.8,
      showAlert: false, // 알림 팝업 상태 추가
      message: "", // 오류 메시지
      colorForBackground: "",
    };
  },
  created() {
    const query = this.$route.query;
    this.characterInfo.characterImage = decodeURIComponent(
      query.characterImage || ""
    );

    this.characterInfo.personalColor = decodeURIComponent(
      query.personalColor || ""
    );

    const mainColorsRaw = decodeURIComponent(query.mainColors || "");
    const subColorsRaw = decodeURIComponent(query.subColors || "");

    this.characterInfo.mainColors = mainColorsRaw
      ? mainColorsRaw.split(",")
      : [];
    this.characterInfo.subColors = subColorsRaw ? subColorsRaw.split(",") : [];
    this.colorForBackground = this.characterInfo.mainColors[0];
  },
  methods: {
    /**
     * 캐릭터 정보를 API에서 검색 및 저장
     */
    async searchCharacter() {
      if (!this.characterName) return; // 캐릭터 이름이 없으면 중단
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/api/characters/info`,
          {
            params: { name: this.characterName },
          }
        );

        this.characterInfo.characterImage =
          response.data.characterInfoDTO.character_image;
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = this.characterInfo.characterImage;

        img.onload = async () => {
          //mixin 활용 컬러분석 메서드 호출
          const sortedColors = await this.extractColors(img);

          const { mainColors, subColors } =
            this.analyzeMainAndSubColors(sortedColors);
          const personalColor = this.determinePersonalColor(
            mainColors,
            subColors
          );

          this.characterInfo.mainColors = mainColors;
          this.colorForBackground = this.characterInfo.mainColors[0];
          this.characterInfo.subColors = subColors;
          this.characterInfo.personalColor = personalColor;
        };
      } catch (error) {
        this.alertMessage = "존재하지 않는 캐릭터입니다";
        this.showAlert = true;
        console.error("캐릭터 정보 조회 실패:", error);
      }
    },
    updateCharacterName(event) {
      this.characterName = event.target.value;
    },
    addColor() {
      if (
        this.savedColors.length < 30 && // 최대 저장 개수
        this.selectedColor &&
        !this.savedColors.includes(this.selectedColor)
      ) {
        this.savedColors.push(this.selectedColor);
      }
    },
    // 저장 영역 비우기
    resetSavedColors() {
      this.savedColors = [];
    },
    toggleZoom() {
      const zoomLevels = [0.8, 1.1, 1.8];
      const currentIndex = zoomLevels.indexOf(this.scale);
      this.scale = zoomLevels[(currentIndex + 1) % zoomLevels.length];
    },
  },
  computed: {
    personalColorGroup() {
      const colorMap = {
        "봄웜 브라이트": "Spring",
        "봄웜 트루": "Spring",
        "봄웜 라이트": "Spring",

        "여름쿨 라이트": "Summer",
        "여름쿨 브라이트": "Summer",
        "여름쿨 뮤트": "Summer",

        "가을웜 뮤트": "Autumn",
        "가을웜 스트롱": "Autumn",
        "가을웜 딥": "Autumn",

        "겨울쿨 브라이트": "Winter",
        "겨울쿨 스트롱": "Winter",
        "겨울쿨 다크": "Winter",
      };

      return colorMap[this.characterInfo.personalColor] || "default";
    },
    colorLabelStyle() {
      const textColorMap = {
        Spring: "#8d5524",
        Summer: "#007acc",
        Autumn: "#a64b2a",
        Winter: "#3a4e80",
        default: "#f6b4d2",
      };
      return {
        color: textColorMap[this.personalColorGroup] || textColorMap.default,
      };
    },
  },
};
</script>

<style scoped>
.main-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 타이틀 영역 */
.color-pick-banner {
  position: relative;
  background: #e6d6ff; /* 연보라 */
  overflow: hidden;
  padding: 4px 10px;
  border-radius: 20px;
  box-shadow: none;
  margin-top: 20px;
}

.color-pick-background {
  background: #e6d6ff; /* 연보라 */
  padding: 15px;
  border-radius: 20px;
}

.color-pick-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff8f0;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(193, 101, 255, 0.8),
    0 0 40px rgba(255, 223, 0, 0.6), 0 0 60px rgba(255, 223, 0, 0.4);
  letter-spacing: 5px;
}

/* shimmer 효과 */
.color-pick-background::before {
  content: "";
  position: absolute;
  top: 0;
  left: -150%;
  width: 150%;
  height: 100%;
  /* 빛나는 효과 */
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transform: skewX(-25deg);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    left: -150%;
  }
  100% {
    left: 150%;
  }
}

/* 검색 영역 */

/* 검색창*/

.search-bar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 8px;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  margin-right: 8px;
}

.search-button {
  background-color: #A2E4D9; /* 기존 민트 유지 */
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #8DD3C7;
}

/* 1번 퍼스널컬러 영역 */
.personal-card {
  padding: 24px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 8px;
}

.personal-color-result {
  font-size: 16px;
  text-align: center;
  padding: 8px;
  margin-bottom: 16px;
  border-radius: 8px;
  color: white;
}

.main-sub-color-row {
  align-items: center;
  padding: 8px 0;
}

.color-label {
  margin-left: 10px;
  font-size: 15px;
  margin-right: 10px;
}

.color-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-right: 10px;
}

/* 메인컬러 영역 */
.main-color-area {
  justify-content: flex-start;
}

/* 서브컬러 영역 */
.sub-color-area {
  justify-content: flex-end;
}

/* 2번 캐릭터이미지 영역 */
.character-card {
  padding: 16px;
  height: 400px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.character-image {
  height: 200px;
  border-radius: 12px;
  transition: transform 0.3s ease-in-out;
}
.toggle-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  padding: 0;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
}
/* 3번 피커영역 */
.custom-picker {
  max-width: 100% !important;
  width: 100% !important;
  height: 367px;
  box-sizing: border-box;
}

.picker-card {
  padding: 16px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 8px;
}

/* 4번 컬러 저장 영역 */
.fixed-add-btn {
  background-color: #ffdbe1;
  color: rgb(0, 0, 0);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 9px;
  margin-bottom: 20px;
  width: 100%;
  font-weight: bold;
  text-align: center;
  transition: background-color 0.3s ease;
}

.fixed-add-btn:hover {
  background-color: #F5EAFD;
}

.picker-saved-colors-box {
  padding: 0 24px 24px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 8px;
  height: 420px;
  overflow-y: auto;
}

.picker-color-result {
  height: 110px;
  width: 110px;
  gap: 20px;
  padding: 12px;
  margin: 20px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  border-radius: 10px;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.picker-color-result:hover {
  transform: scale(1.1);
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
}

.refresh-btn {
  position: absolute;
  background-color: #dfdadeb8 !important;
  top: 10px;
  right: 10px;
  width: 30px !important;
  height: 30px !important;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  min-width: 30px !important;
}

.refresh-btn:hover {
  background-color: #d6d6d6;
}

.refresh-btn .v-icon {
  font-size: 16px !important;
}

.heart-icon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    vertical-align: middle;
}

.search-icon {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    vertical-align: middle;
}


@media (max-width: 600px) {
  :deep(.v-container),
  :deep(.v-row),
  :deep(.v-col) {
    margin: 0 !important;
    padding: 0 !important;
  }
}
</style>
