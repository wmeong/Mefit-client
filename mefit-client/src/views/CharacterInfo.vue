<template>
  <v-container class="main-container" fluid>
    <!-- 데이터가 없을 경우 -->
    <div v-if="!characterInfo.character_name">
      <h2>닉네임을 입력하세요</h2>
      <div class="search-bar">
        <button class="search-icon" @click="searchAndSaveCharacter">🔎</button>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          :value="characterName"
          @input="updateCharacterName"
          @keydown.enter.prevent="searchAndSaveCharacter"
        />
      </div>
    </div>

    <!-- 데이터가 있을 경우 -->
    <div v-else>
      <!-- 검색창 -->
      <v-row dense class="search-bar-row">
        <v-col cols="12" md="12">
          <div class="search-bar-container">
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              :value="characterName"
              class="search-input"
              @input="updateCharacterName"
              @keydown.enter.prevent="searchAndSaveCharacter"
            />

            <button @click="searchAndSaveCharacter" class="search-button">🔍 검색</button>
          </div>
        </v-col>
      </v-row>
      <!-- 상위 영역 -->
      <v-row class="upper-side" dense>
        <!-- 1번 기본 정보 영역 -->
        <v-col cols="12" md="3">
          <div class="modern-card">
            <h3 class="font-weight-bold">캐릭터 정보</h3>
            <table class="character-info-table">
              <tbody>
                <!-- 레벨 -->
                <tr>
                  <td class="icon-cell">
                    <v-avatar class="level-icon" color="#808080" size="24">
                      <span class="level-text">Lv</span>
                    </v-avatar>
                  </td>
                  <td class="data-cell">
                    <span class="badge">
                      {{
                      characterInfo.character_level ||
                      "레벨"
                      }}
                    </span>
                  </td>
                </tr>
                <!-- 월드 -->
                <tr>
                  <td class="icon-cell">
                    <img
                      v-if="characterInfo.world_name"
                      :src="getWorldIcon(
                                            characterInfo.world_name
                                        )
                                            "
                      alt="world-icon"
                      class="world-icon"
                    />
                  </td>
                  <td class="data-cell">
                    <span class="badge">
                      {{
                      characterInfo.world_name ||
                      "월드명"
                      }}
                    </span>
                  </td>
                </tr>
                <!-- 성별 -->
                <tr>
                  <td class="icon-cell">
                    <v-avatar
                      :color="characterInfo.character_gender ===
                                            '여'
                                            ? '#FFC0CB'
                                            : '#87CEEB'
                                            "
                      size="24"
                      class="gender-icon"
                    >
                      <v-icon small color="white">
                        {{
                        characterInfo.character_gender ===
                        "여"
                        ? "mdi-gender-female"
                        : "mdi-gender-male"
                        }}
                      </v-icon>
                    </v-avatar>
                  </td>
                  <td class="data-cell">
                    <span class="badge">
                      {{
                      characterInfo.character_gender ||
                      "성별"
                      }}
                    </span>
                  </td>
                </tr>

                <!-- 길드 -->
                <tr>
                  <td class="icon-cell">
                    <v-avatar class="guild-icon" color="#87CEEB" size="24">
                      <span class="guild-text">G</span>
                    </v-avatar>
                  </td>
                  <td class="data-cell">
                    <span class="badge">
                      {{
                      characterInfo.character_guild_name ||
                      "길드명"
                      }}
                    </span>
                  </td>
                </tr>
                <!-- 직업 -->
                <tr>
                  <td class="icon-cell">
                    <img
                      :src="getJobIcon(
                                            characterInfo.character_class
                                        )
                                            "
                      alt="job-icon"
                      class="job-icon"
                    />
                  </td>
                  <td class="data-cell">
                    <span class="badge">
                      {{
                      characterInfo.character_class ||
                      "직업"
                      }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </v-col>

        <!-- 2번 : 캐릭터 이미지 영역 -->
        <v-col cols="12" md="4">
          <div class="character-container">
            <!-- 동작(action)과 감정(emotion) 선택 셀렉트 박스 -->
            <!-- 동작 선택 셀렉트 박스 -->
            <v-select
              label="동작 선택"
              :items="actionOptions"
              item-title="codeKorean"
              item-value="code"
              v-model="selectedAction"
              dense
              outlined
              @change="updateCharacterImage"
            />

            <!-- 감정 선택 셀렉트 박스 -->
            <v-select
              label="감정 선택"
              :items="emotionOptions"
              item-title="codeKorean"
              item-value="code"
              v-model="selectedEmotion"
              dense
              outlined
              @change="updateCharacterImage"
            />

            <!-- 무기제외 버튼 -->
            <v-btn @click="applyWeaponMotion" color="primary" outlined>무기제외</v-btn>

            <!-- 캐릭터 이미지 -->
            <v-img
              :src="characterInfo.character_image ||
                            'https://via.placeholder.com/150'
                            "
              alt="Character Image"
              class="character-image"
              :style="{
                                transform: `scale(${scale})`,
                                transition: 'transform 0.3s ease-in-out',
                                'margin-bottom': '40px',
                            }"
            ></v-img>
            <!-- 버튼 그룹 -->
            <div class="button-group">
              <!-- 확대/축소 버튼 -->
              <v-btn
                @click="toggleZoom"
                class="modern-btn"
                elevation="2"
                style="width: 40px; padding: 0; min-width: 40px"
              >
                <v-icon size="20">
                  {{
                  scale === 0.7
                  ? "mdi-magnify-plus-outline"
                  : "mdi-magnify-minus-outline"
                  }}
                </v-icon>
              </v-btn>
              <!-- 다운로드 버튼 -->
              <v-btn
                @click="downloadImage"
                class="modern-btn"
                elevation="2"
                style="width: 40px; padding: 0; min-width: 40px"
              >
                <v-icon size="20">mdi-download</v-icon>
              </v-btn>
            </div>
          </div>
        </v-col>

        <!-- 3번: 퍼스널 컬러 영역 -->
        <v-col cols="12" md="5">
          <div class="modern-card">
            <h3 class="font-weight-bold">퍼스널컬러</h3>
            <!-- 퍼스널 컬러 분석 결과 -->
            <div
              :class="[
                            'text-center',
                            'personal-color-result',
                            personalColorGroup,
                        ]"
              @click="navigateToPersonalColorPage"
              style="cursor: pointer"
            >{{ personalColorAnalysis }}</div>

            <!-- 메인 컬러 표시 -->
            <v-row class="main-color mb-0 pb-0">
              <v-col cols="3" class="text-left">
                <h4 class="text-left color-label">메인컬러</h4>
              </v-col>
              <v-col cols="9" class="d-flex">
                <v-avatar
                  v-for="(
                                        color, index
                                    ) in characterInfo.main_colors || [
                                                '#ccc',
                                                '#ddd',
                                            ]"
                  :key="'main-color-' + index"
                  :color="color"
                  size="33"
                  class="mr-2"
                ></v-avatar>
              </v-col>
            </v-row>

            <!-- 서브컬러 표시 -->
            <v-row class="sub-color mt-0 pt-0">
              <v-col cols="3" class="text-left">
                <h4 class="text-left color-label">서브컬러</h4>
              </v-col>
              <v-col cols="9" class="d-flex">
                <v-avatar
                  v-for="(
                                        color, index
                                    ) in characterInfo.sub_colors || [
                                                '#eee',
                                                '#fff',
                                            ]"
                  :key="'sub-color-' + index"
                  :color="color"
                  size="33"
                  class="mr-2"
                ></v-avatar>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </div>
    <!-- 4번 : 캐시 장비 정보 영역 -->
    <v-row class="mt-4" dense>
      <v-col
        v-for="item in filteredItems"
        :key="item.type"
        cols="12"
        sm="6"
        md="4"
        class="equipment-item"
      >
        <!-- 중앙 정렬을 위한 flex 컨테이너 -->
        <div class="equipment-content">
          <!-- 아이콘 -->
          <div class="equipment-icon-container">
            <img :src="item.icon" :alt="item.type" class="equipment-icon" />
          </div>
          <!-- 캐시 장비 정보 -->
          <div class="equipment-details">
            <span class="equipment-name">{{ item.name }}</span>
            <br />
            <span class="equipment-type">{{ item.type }}</span>
            <p class="equipment-subdetails" v-if="item.colorRange">
              계열: {{ item.colorRange }}
              <br />
              색: {{ item.colorHue }} 채:
              {{ item.colorSaturation }} 명: {{ item.colorValue }}
            </p>
            <p class="equipment-subdetails" v-else-if="item.mixColor">
              {{ item.baseColor }} : {{ item.baseColorRate }}
              <br />
              {{ item.mixColor }} : {{ item.mixColorRate }}
            </p>
            <p class="equipment-subdetails" v-else-if="item.colorStyle">
              계열: {{ item.colorStyle }}
              <br />
              색: {{ item.skinHue }} 채:
              {{ item.skinSaturation }} 명:
              {{ item.skinBrightness }}
            </p>
          </div>
        </div>
      </v-col>
    </v-row>
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

export default {
  name: "CharacterInfo",
  components: { CustomAlert },
  data() {
    return {
      scale: 0.7, // 초기 확대 배율
      characterName: "", // 검색어
      characterInfo: {}, // 캐릭터 정보 데이터
      showAlert: false, // 알림 팝업 상태 추가
      message: "", // 오류 메시지
      characterCashItem: [],
      characterCashFace: [],
      personalColorAnalysis: "",
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
        { type: "무기", icon: "", name: "" }
      ],
      actionOptions: [], // 초기 빈 배열
      emotionOptions: [], // 초기 빈 배열
      selectedAction: null,
      selectedEmotion: null
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
        이노시스: "enosis",
        에오스: "eos",
        헬리오스: "helios",
        루나: "luna",
        노바: "nova",
        레드: "red",
        스카니아: "scania",
        유니온: "union",
        제니스: "zenith"
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
    updateCharacterName(event) {
      this.characterName = event.target.value; // 입력값 명시적 동기화
    },
    /**
     * 캐릭터 정보를 API에서 검색 및 저장
     */
    async searchAndSaveCharacter() {
      if (!this.characterName) return; // 캐릭터 이름이 없으면 중단
      try {
        const ocidResponse = await axios.get(
          `http://localhost:8081/api/characters/ocid`,
          {
            params: {
              name: this.characterName,
              personalColor: this.personalColorAnalysis
            }
          }
        );
        this.characterInfo = ocidResponse.data.characterInfoDTO;
        this.message = "";

        this.characterCashItem = ocidResponse.data.searchedCashItemDTOS;
        this.characterCashFace = ocidResponse.data.searchedCashFaceDTOS;

        this.loadMotionData(); // 페이지 로드 시 동작/감정 데이터 가져오기
        // 이미지가 로드된 후 extractColors 실행
        const img = new Image();
        img.crossOrigin = "Anonymous"; // 크로스 도메인 이미지 처리
        img.src = this.characterInfo.character_image;

        img.onload = async () => {
          await this.extractColors(img); // ✅ 퍼스널컬러 분석을 기다린 후 실행
          this.savePersonalColor(); // ✅ 퍼스널컬러 분석이 끝난 후 저장
        };

        this.message = "";
      } catch (error) {
        console.error("캐릭터 정보를 불러오는 중 오류가 발생했습니다:", error);
        this.showAlert = true; // 오류 발생 시 알림 팝업 표시
        this.message = "캐릭터 정보를 불러오는 중 오류가 발생했습니다.";
      }
    },
    /**
     * 캐릭터 이미지 URL을 업데이트하는 메서드
     */
    updateCharacterImage() {
      const baseImageUrl = this.characterInfo.character_image.split("?")[0]; // 기본 이미지 URL
      const params = new URLSearchParams();

      // 선택된 동작(action)과 감정(emotion)을 URL 파라미터로 추가
      if (this.selectedAction) params.append("action", this.selectedAction);
      if (this.selectedEmotion) params.append("emotion", this.selectedEmotion);

      // 무기제외(wmotion) 파라미터 추가
      if (this.selectedWeaponMotion) params.append("wmotion", "W04");

      // 새로운 이미지 URL 생성
      this.characterImage = `${baseImageUrl}?${params.toString()}`;

      console.log("Updated Image URL:", this.characterImage); // 콘솔에서 확인
    },

    /**
     * 동작 및 감정 표현 데이터 로드
     */
    async loadMotionData() {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/characters/motions`
        );
        const motions = response.data;

        // 데이터가 있는지 확인
        console.log("응답 데이터:", motions);

        // 동작과 감정 옵션을 분리하여 필터링
        this.actionOptions = motions.filter(m => m.category === "action");
        this.emotionOptions = motions.filter(m => m.category === "emotion");

        // 필터링 후 데이터 확인
        console.log("actionOptions:", this.actionOptions);
        console.log("emotionOptions:", this.emotionOptions);
      } catch (error) {
        console.error("동작 및 감정 데이터를 불러오는 중 오류 발생:", error);
      }
    },

    /**
     * 무기제외 버튼 클릭 시 wmotion 추가
     */
    applyWeaponMotion() {
      // 무기제외를 선택했을 때 updateCharacterImage를 호출하여 wmotion 파라미터 추가
      this.selectedWeaponMotion = "W04";
      this.updateCharacterImage();
    },

    async savePersonalColor() {
      const personalColor = this.personalColorAnalysis;

      console.log("퍼스널컬러:" + personalColor);

      try {
        await axios.post(
          `http://localhost:8081/api/characters/personal-color`,
          new URLSearchParams({
            characterImage: this.characterInfo.character_image,
            personalColor: this.personalColorAnalysis
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
        console.log("퍼스널컬러 정보가 성공적으로 전송되었습니다.");
      } catch (error) {
        console.error("퍼스널컬러 전송 중 오류가 발생했습니다:", error);
      }
    },
    getJobIcon(jobName) {
      try {
        return require(`@/assets/job/${jobName}.png`);
      } catch (e) {
        return null;
      }
    },
    //퍼스널컬러 페이지로 이동
    navigateToPersonalColorPage() {
      const color = this.personalColorAnalysis;
      const encodedColor = encodeURIComponent(color); // URL 인코딩
      this.$router.push(`/personal-color-twelve/${encodedColor}`);
    },
    //퍼스널칼라 분석 부분
    async extractColors(img) {
      return new Promise(resolve => {
        // ✅ 동적으로 Canvas 생성
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
        const colorCounts = {};

        // ✅ 이미지 데이터를 순회하여 색상 정보를 수집
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

          // ✅ 너무 어둡거나 밝은 색상, 채도가 낮은 색상 제외
          if (hsv.v < 5 || hsv.v > 90 || hsv.s < 3) continue;

          // **HSV 근처 색상 통합**
          const roundedH = Math.round(hsv.h / 5) * 5;
          const roundedS = Math.round(hsv.s / 5) * 5;
          const roundedV = Math.round(hsv.v / 5) * 5;
          const key = `${roundedH},${roundedS},${roundedV}`;

          colorCounts[key] = (colorCounts[key] || 0) + 1;
        }

        // ✅ 상위 30개 색상 추출 및 가중치 계산
        const sortedColors = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 30);

        let hSum = 0,
          sSum = 0,
          vSum = 0,
          totalWeight = 0;
        const weights = sortedColors.map((_, index) =>
          index < 20 ? 0.1 : 0.02
        );

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

        // ✅ 최종 퍼스널컬러 분석
        this.personalColorAnalysis = this.findClosestPersonalColor(
          avgH,
          avgS,
          avgV
        );

        // ✅ Canvas 제거
        canvas.remove();

        resolve();
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
      return this.REQUIRED_ITEM_TYPES.map(requiredItemType => {
        const cashItemData = this.characterCashItem.find(
          itemData => itemData.item_type === requiredItemType.type
        );

        const cashFaceData = this.characterCashFace.find(
          itemData => itemData.item_type === requiredItemType.type
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
            colorValue: cashItemData.color_value || 0
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
            skinBrightness: cashFaceData.skin_brightness || 0
          };
        }

        // 기본값 반환
        if (requiredItemType.name) {
          return {
            type: requiredItemType.type,
            icon: requiredItemType.icon || "https://via.placeholder.com/50",
            name: requiredItemType.name
          };
        }

        return null; // 아이템이 없으면 null
      }).filter(item => item !== null);
    },
    //퍼스널컬러 배경색 지정
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
        "겨울쿨 다크": "Winter"
      };

      return colorMap[this.personalColorAnalysis] || "default";
    }
  }
};
</script>

<style scoped>
.main-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
  /* 양쪽 패딩 설정 */
}

.character-container {
  position: relative;
  height: 230px;
  margin: 0 auto;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  /* overflow: hidden; */
  /* 히든버튼 */
}

.character-image {
  height: 200px;
  /* 이미지 최대 높이 */
  width: auto;
  display: block;
  margin: 0 auto;
  /* 이미지 가운데 정렬 */
}

/*1,2,3, 일렬로 */
.character-info {
  text-align: left;
  padding-left: 5px;
  margin-top: 20px;
}

.equipment-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  /* 가로 정렬을 왼쪽으로 고정 */
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  background-color: #ffffff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  min-height: 120px;
  /* 적절한 최소 높이 설정 */
  transition: border 0.3s ease, box-shadow 0.3s ease;
}

.equipment-content {
  display: flex;
  align-items: center;
  /* 수직 가운데 정렬 */
  width: 100%;
  /* 가로 정렬 문제 해결 */
}

.equipment-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.equipment-icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  margin-left: 10px;
  padding: 6px;
  background-color: #f9f9f9;
}

.equipment-item:hover {
  border: 1px solid #ff88aa;
  box-shadow: 0px 4px 10px rgba(255, 136, 170, 0.3);
}

.equipment-details {
  flex-grow: 1;
  text-align: left;
  line-height: 1.5;
  margin-left: 13px;
}

.equipment-name {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
}

.equipment-type {
  font-size: 12px;
  color: #335cc4ad;
}

.equipment-subdetails {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.button-row {
  margin-top: 16px;
  /* 버튼과 이미지 간격 */
  display: flex;
  justify-content: center;
  /* 버튼을 가운데 정렬 */
  gap: 16px;
  /* 버튼 간격 */
}

.button-row v-btn {
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  /* 버튼 그림자 */
}

.zoom-button-container {
  margin-top: 55px;
  /* 이미지와 버튼 사이 간격을 더 넓게 */
  text-align: center;
}

.button-group {
  position: absolute;
  bottom: 16px;
  /* 컨테이너 하단에서 여백 */
  right: 16px;
  /* 컨테이너 오른쪽에서 여백 */
  display: flex;
  gap: 8px;
  /* 버튼 간 간격 */
  z-index: 10;
  /* 이미지 위에 위치 */
}

.button-group v-btn {
  width: 40px;
  /* 버튼 크기 */
  height: 40px;
  border-radius: 50%;
  /* 원형 버튼 */
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.search-bar {
  display: flex;
  align-items: center;
  border: 2px solid #ffccff;
  border-radius: 20px;
  padding: 8px 12px;
  width: 300px;
  margin: 0 auto;
  box-shadow: 0 0 8px #ffccff;
  transition: box-shadow 0.3s ease;
  background-color: #fff5ff;
}

.search-bar input {
  border: none;
  outline: none;
  font-size: 14px;
  flex: 1;
  background: none;
}

.search-bar input::placeholder {
  color: #ff88aa;
}

.badge {
  display: inline-block;
  padding: 0px 8px;
  /* 텍스트 주변 여백 */
  border: 1px solid #ccc;
  /* 테두리 색상 */
  border-radius: 12px;
  /* 둥근 테두리 */
  background-color: #f5f5f5;
  /* 배경색 */
  font-size: 0.875rem;
  /* 글씨 크기 */
  font-weight: 500;
  /* 글씨 굵기 */
  color: #333;
  /* 텍스트 색상 */
  margin-right: 8px;
  /* 요소 간 간격 */
}

.character-info-table {
  margin-top: 10px;
  margin-left: 8px;
  border-spacing: 0 8px;
  /* 위아래 갭 추가 */
  border-collapse: separate;
  /* 셀 간격 유지 */
}

.icon-cell {
  display: flex;
  justify-content: center;
  /* 가로 정렬 */
  align-items: center;
  /* 세로 정렬 */
  height: 100%;
  /* 부모 높이에 맞춤 */
}

.data-cell {
  text-align: left;
  vertical-align: middle;
  padding-left: 13px;
  /* 데이터 셀 왼쪽 패딩 */
}

.gender-icon,
.guild-icon,
.job-icon {
  width: 20px;
  /* 아이콘 크기 */
  height: 20px;
}

.world-icon {
  width: 27px;
  height: 27px;
}

.level-icon,
.guild-icon,
.job-icon {
  width: 24px;
  height: 24px;
}

.level-text,
.guild-text {
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
  color: white;
}

.gender-icon {
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  /* 아이콘 크기 */
  font-weight: bold;
  line-height: 1;
}

.world-guild {
  margin-top: 8px;
  /* 레벨/성별과 간격 */
}

.job-image {
  width: 80px;
  /* 직업 이미지 크기 */
  height: 80px;
  border-radius: 8px;
  margin-bottom: 8px;
  /* 직업 이름과 간격 */
}

.job-badge {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 12px;
}

/* 검색창*/
.search-bar-container {
  display: flex;
  justify-content: center;
  /* 가운데 정렬 */
  align-items: center;
  width: 100%;
  /* 전체 길이 */
  padding: 12px 16px;
  /* 여백 추가 */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  /* 부드러운 그림자 */
  background-color: #ffffff;
  /* 배경색 */
  border-radius: 8px;
  /* 둥근 모서리 */
  margin-bottom: 16px;
  /* 아래 컨텐츠와 간격 */
}

.search-input {
  flex: 1;
  /* 검색창 너비를 버튼과 함께 조정 */
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  margin-right: 8px;
}

.search-button {
  background-color: #d96dcb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;

  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #e58cda;
}

/*퍼스널컬러*/
.modern-card {
  height: 230px;
  background-color: #ffffff;
  color: #2c3e50;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/*퍼스널컬러 결과 */
.personal-color-result {
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  padding: 4px 8px;
  /* 패딩 조정 */
  text-align: center;
  margin-top: 8px;
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

.main-color {
  margin-top: 10px;
  margin-bottom: 0 !important;
  /* 하단 마진 제거 */
  padding-bottom: 0 !important;
  /* 하단 패딩 제거 */
}

.sub-color {
  margin-top: 0 !important;
  /* 하단 마진 제거 */
  padding-top: 0 !important;
  /* 하단 패딩 제거 */
}

.color-label {
  background-color: #f5f5f5;
  /* 회색 배경 */
  padding: 1px 2px;
  border-radius: 12px;
  font-weight: bold;
  color: #333;
}
</style>
