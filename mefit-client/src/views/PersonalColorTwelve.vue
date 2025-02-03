<template>
  <v-container class="personal-color-container">
    <!-- 상단 네비 -->
    <v-row class="upper-navi">
      <v-col>
        <!-- 퍼스널컬러 화면으로 돌아가기 -->
        <v-icon color="grey darken-1" size="18">mdi-chevron-right</v-icon>
        <span class="hover-personal-color" @click="navigateToPersonalColorPage">퍼스널컬러</span>

        <!-- 메인시즌 표시 -->
        <v-icon color="grey darken-1" size="18">mdi-chevron-right</v-icon>
        <span class="hover-main-season" @click="navigateToMainSeason">{{ mainSeason }}</span>
      </v-col>
    </v-row>

    <!-- 제목 및 설명 -->
    <v-row justify="center" align="center" class="title-container">
      <v-col cols="auto" class="text-center">
        <h2 class="page-title">{{ colorName }}</h2>
      </v-col>
      <v-col cols="auto" class="text-right">
        <v-btn
          class="refresh-button"
          icon
          small
          color="primary"
          v-tooltip.bottom="'새로고침'"
          @click="fetchToneData"
        >
          <v-icon size="15">mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <!-- 색상 팔레트 -->
    <div class="palette-section" v-if="palette.length">
      <h3 class="palette-text">🎨 색상 팔레트</h3>
      <div class="palette-row">
        <div v-for="(color, index) in palette" :key="index" class="color-box-wrapper">
          <!-- 색상 네모 상자 -->
          <div class="color-box" :style="{ backgroundColor: color.hex }"></div>
          <!-- 하단 텍스트 표시 -->
          <div class="color-label">{{ color.name }}</div>
        </div>
      </div>
    </div>

    <!-- 캐릭터 아바타 그리드 -->
    <v-row justify="center" class="avatar-grid">
      <v-col cols="12" class="text-center">
        <h4>🌟 Character Showcase 🌟</h4>
      </v-col>
      <v-col
        v-for="(avatar, index) in avatars"
        :key="index"
        cols="3"
        class="text-center avatar-container"
      >
        <!-- 캐릭터 이미지 -->
        <img
          :src="avatar.characterImage"
          alt="Character Avatar"
          class="avatar-img"
          @click="openPopup(avatar.characterImage)"
        />
        <!-- 하트 버튼 -->
        <div class="vote-container">
          <v-icon
            class="heart-icon"
            :style="{ color: votedCharacters.has(avatar.characterImage) ? '#FF0000' : '#FFB6C1' }"
            @click="voteForAvatar($event, avatar)"
          >{{ votedCharacters.has(avatar.characterImage) ? "mdi-heart" : "mdi-heart-outline" }}</v-icon>
        </div>
      </v-col>
    </v-row>

    <!-- CharacterInfoPopup 컴포넌트 -->
    <CharacterInfoPopup
      v-if="selectedCharacter"
      :model-value="popupVisible"
      @update:model-value="popupVisible = $event"
      :character="selectedCharacter"
    />
    <CustomAlert
      v-if="showAlert"
      :visible="showAlert"
      title="알림"
      :message="alertMessage"
      @close="showAlert = false"
      @confirm="onPopupConfirm"
    />
  </v-container>
</template>

<script>
import CharacterInfoPopup from "./CharacterInfoPopup.vue";
import axios from "axios";
import CustomAlert from "@/components/CustomAlert.vue";

export default {
  components: { CharacterInfoPopup, CustomAlert },
  props: ["color"],
  data() {
    return {
      avatars: [],
      popupVisible: false,
      selectedCharacter: null,
      votedCharacters: new Set(), // ✅ 투표한 캐릭터 저장
      showAlert: false, // ✅ 공통 팝업 표시 여부
      alertMessage: "", // ✅ 공통 팝업 메시지
      personalColorData: {
        // 🌸 봄 웜톤 (Spring Warm Tone)
        "봄웜 라이트": [
          { name: "라이트 코랄", hex: "#F08080" },
          { name: "라이트 옐로우", hex: "#FFFFE0" },
          { name: "피치 퍼프", hex: "#FFDAB9" },
          { name: "크림 핑크", hex: "#FFF0F5" },
          { name: "라이트 민트", hex: "#E0FFF0" },
          { name: "라일락", hex: "#E6E6FA" },
          { name: "소프트 블루", hex: "#ADD8E6" },
          { name: "파우더 블루", hex: "#B0E0E6" }
        ],
        "봄웜 브라이트": [
          { name: "라이트 오렌지", hex: "#FFA07A" },
          { name: "피치 핑크", hex: "#FFD1DC" },
          { name: "라이트 골드", hex: "#F9E79F" },
          { name: "소프트 코랄", hex: "#FF7F50" },
          { name: "샴페인 핑크", hex: "#F2D4CC" },
          { name: "스칼렛 레드", hex: "#FF2400" },
          { name: "라이트 레몬", hex: "#F8E473" },
          { name: "크림 화이트", hex: "#FFFDD0" }
        ],
        "봄웜 트루": [
          { name: "살구", hex: "#FFB07C" },
          { name: "크림 옐로우", hex: "#FFFDD0" },
          { name: "소프트 코랄", hex: "#FF7F50" },
          { name: "카멜 브라운", hex: "#A0785A" },
          { name: "페일 골드", hex: "#E6BE8A" },
          { name: "딥 살구", hex: "#F28E63" },
          { name: "피치 골드", hex: "#F5BD47" },
          { name: "아이보리", hex: "#FFFFF0" }
        ],

        // ❄️ 여름 쿨톤 (Summer Cool Tone)
        "여름쿨 라이트": [
          { name: "베이비 블루", hex: "#ADD8E6" },
          { name: "라벤더", hex: "#E6E6FA" },
          { name: "소프트 민트", hex: "#B8E2DC" },
          { name: "페일 핑크", hex: "#FFD1DC" },
          { name: "라이트 아쿠아", hex: "#D0F0F0" },
          { name: "실버 그레이", hex: "#C0C0C0" },
          { name: "페일 블루", hex: "#AEC6CF" },
          { name: "라이트 청록", hex: "#E0FFFF" }
        ],
        "여름쿨 브라이트": [
          { name: "아쿠아 블루", hex: "#00FFFF" },
          { name: "핑크 라일락", hex: "#D8BFD8" },
          { name: "라이트 퍼플", hex: "#C8A2C8" },
          { name: "아쿠아 마린", hex: "#7FFFD4" },
          { name: "크림 블루", hex: "#CDE7F0" },
          { name: "더스티 핑크", hex: "#DCAE96" },
          { name: "소프트 라일락", hex: "#D3BCCC" },
          { name: "민트 블루", hex: "#8EE5EE" }
        ],
        "여름쿨 뮤트": [
          { name: "더스티 로즈", hex: "#DCAE96" },
          { name: "소프트 블루", hex: "#B0C4DE" },
          { name: "페일 라일락", hex: "#C8A2C8" },
          { name: "더스티 민트", hex: "#A9D6CC" },
          { name: "라이트 인디고", hex: "#B0A4E3" },
          { name: "라일락 그레이", hex: "#D8D3E3" },
          { name: "페일 바이올렛", hex: "#D0CCE0" },
          { name: "실버 블루", hex: "#B0C4E3" }
        ],

        // 🍂 가을 웜톤 (Autumn Warm Tone)
        "가을웜 뮤트": [
          { name: "모카 브라운", hex: "#8B4513" },
          { name: "더스티 옐로우", hex: "#F5DEB3" },
          { name: "올리브 그린", hex: "#808000" },
          { name: "브론즈", hex: "#CD7F32" },
          { name: "샌드 베이지", hex: "#F4A460" },
          { name: "스파이스 오렌지", hex: "#D2691E" },
          { name: "토프 브라운", hex: "#7F6A55" },
          { name: "머스타드 옐로우", hex: "#FFDB58" }
        ],
        "가을웜 스트롱": [
          { name: "마호가니", hex: "#C04000" },
          { name: "딥 머스타드", hex: "#B8860B" },
          { name: "루비 레드", hex: "#9B111E" },
          { name: "더스티 브라운", hex: "#A0522D" },
          { name: "피넛 브라운", hex: "#DAA520" },
          { name: "타우니 브라운", hex: "#884C23" },
          { name: "레드 우드", hex: "#A45A52" },
          { name: "골드 옐로우", hex: "#FFD700" }
        ],
        "가을웜 딥": [
          { name: "초콜릿 브라운", hex: "#3F1E12" },
          { name: "버건디", hex: "#800020" },
          { name: "다크 오렌지", hex: "#FF8C00" },
          { name: "카키 그린", hex: "#4B5320" },
          { name: "브론즈 브라운", hex: "#8A3324" },
          { name: "버터스카치", hex: "#E3963E" },
          { name: "딥 옐로우", hex: "#FFB84D" },
          { name: "마룬", hex: "#800000" }
        ],

        // 🌌 겨울 쿨톤 (Winter Cool Tone)
        "겨울쿨 브라이트": [
          { name: "브릴리언트 블루", hex: "#007FFF" },
          { name: "아이시 핑크", hex: "#FFD1DC" },
          { name: "라임 그린", hex: "#32CD32" },
          { name: "네온 블루", hex: "#1E90FF" },
          { name: "퍼시픽 블루", hex: "#009DC4" },
          { name: "사파이어", hex: "#0F52BA" },
          { name: "화이트", hex: "#FFFFFF" },
          { name: "스칼렛 레드", hex: "#FF2400" }
        ],
        "겨울쿨 스트롱": [
          { name: "딥 네이비", hex: "#001F54" },
          { name: "다크 퍼플", hex: "#4B0082" },
          { name: "체리 레드", hex: "#DE3163" },
          { name: "차콜 그레이", hex: "#36454F" },
          { name: "포레스트 그린", hex: "#228B22" },
          { name: "클래식 레드", hex: "#B22222" },
          { name: "로얄 블루", hex: "#4169E1" },
          { name: "다크 터쿼이즈", hex: "#00CED1" }
        ],
        "겨울쿨 다크": [
          { name: "다크 블루", hex: "#00008B" },
          { name: "플럼 퍼플", hex: "#673147" },
          { name: "와인 레드", hex: "#722F37" },
          { name: "다크 그레이", hex: "#2F4F4F" },
          { name: "미드나잇 블루", hex: "#191970" },
          { name: "디퓨즈드 블랙", hex: "#101820" },
          { name: "딥 퍼플", hex: "#4B0082" },
          { name: "더크 브라운", hex: "#5B504F" }
        ]
      }
    };
  },
  computed: {
    colorName() {
      return decodeURIComponent(this.color);
    },
    palette() {
      return this.personalColorData[this.colorName] || [];
    },
    mainSeason() {
      const seasonMapping = {
        "봄웜 라이트": "봄",
        "봄웜 브라이트": "봄",
        "봄웜 트루": "봄",
        "여름쿨 라이트": "여름",
        "여름쿨 브라이트": "여름",
        "여름쿨 뮤트": "여름",
        "가을웜 뮤트": "가을",
        "가을웜 스트롱": "가을",
        "가을웜 딥": "가을",
        "겨울쿨 브라이트": "겨울",
        "겨울쿨 스트롱": "겨울",
        "겨울쿨 다크": "겨울"
      };
      return seasonMapping[this.colorName] || "";
    }
  },
  methods: {
    async fetchToneData() {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/personal/tone`,
          {
            params: { tone: this.color }
          }
        );
        this.avatars = response.data;
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
      }
    },
    async voteForAvatar(event, avatar) {
      event.stopPropagation();

      if (this.votedCharacters.has(avatar.characterImage)) {
        this.alertMessage = "이 캐릭터의 투표를 취소하시겠습니까?";
        this.showAlert = true;

        this.onPopupConfirm = async () => {
          try {
            await axios.delete("http://localhost:8081/api/personal/vote", {
              params: { characterImage: avatar.characterImage }
            });
            this.votedCharacters.delete(avatar.characterImage);
            this.saveHeartState();
          } catch (error) {
            console.error("투표 취소 중 오류 발생:", error);
          } finally {
            this.showAlert = false;
          }
        };

        return;
      }

      if (!avatar || !avatar.characterImage || !avatar.personalColor) {
        console.error("❌ 유효하지 않은 캐릭터 데이터:", avatar);
        return;
      }

      try {
        await axios.post("http://localhost:8081/api/personal/vote", null, {
          params: {
            characterImage: avatar.characterImage,
            personalColor: avatar.personalColor
          }
        });
        this.votedCharacters.add(avatar.characterImage);
        this.saveHeartState();
      } catch (error) {
        console.error("투표 중 오류 발생:", error);
      }
    },
    openPopup(characterImage) {
      this.selectedCharacter = { image: characterImage };
      this.popupVisible = true;
    },
    navigateToPersonalColorPage() {
      this.$router.push({
        name: "PersonalColorSelect"
      });
    },
    navigateToMainSeason() {
      const seasonRoutes = {
        봄: "spring",
        여름: "summer",
        가을: "fall",
        겨울: "winter"
      };

      const season = seasonRoutes[this.mainSeason];
      if (season) {
        this.$router.push({
          name: "PersonalColorDetail",
          query: { season }
        });
      }
    },
    saveHeartState() {
      const state = {
        votedCharacters: Array.from(this.votedCharacters),
        timestamp: Date.now()
      };
      localStorage.setItem("heartState", JSON.stringify(state));
    },
    loadHeartState() {
      const state = JSON.parse(localStorage.getItem("heartState"));
      if (state && !this.isExpired(state.timestamp)) {
        this.votedCharacters = new Set(state.votedCharacters);
      } else {
        localStorage.removeItem("heartState");
      }
    },
    isExpired(timestamp) {
      const thirtyMinutes = 30 * 60 * 1000; // 30분 (밀리초 단위)
      return Date.now() - timestamp > thirtyMinutes;
    }
  },
  mounted() {
    this.fetchToneData();
    this.loadHeartState();
  }
};
</script>

<style scoped></style>

<style scoped>
.title-container {
  position: relative;   
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #4c4c4c;
}
/*네비*/
.upper-navi {
  position: absolute;
  top: 20px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.hover-personal-color,
.hover-main-season {
  cursor: pointer;
  color: #424242; 
  transition: color 0.2s ease, text-decoration 0.2s ease;
}

.hover-personal-color:hover,
.hover-main-season:hover {
  color: #edc1f1f8;
  text-decoration: underline;
}

.refresh-button {
  position: absolute;
  top: 15px;
  right: 70px; 
  background-color: #afacacb8 !important;
  width: 30px !important;
  height: 30px !important;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.personal-color-container {
  position: relative; 
  padding: 20px;
}

.header-section h2 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.recommend-section,
.style-tips {
  margin-top: 40px;
}

.palette-grid,
.recommend-grid {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.color-box,
.recommend-box {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 0.9rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.style-tips ul {
  list-style-type: disc;
  padding-left: 20px;
  color: #555;
}

.style-tips ul li {
  margin-bottom: 10px;
}
.avatar-grid {
  margin-top: 40px;
}
.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.vote-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.heart-icon {
  cursor: pointer;
  font-size: 24px;
  transition: transform 0.2s ease;
}
.heart-icon:hover {
  transform: scale(1.2);
}

/*색상카드 */
.palette-section {
  margin-top: 20px;
  text-align: center;
}

.palette-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.color-box-wrapper {
  width: 100px;
  text-align: center;
}

.color-box {
  width: 100px;
  height: 100px;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.color-label {
  background-color: #fff;
  color: #333333bc;
  font-size: 11px;
  font-weight: bold;
  padding: 5px;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/*팔레트 텍스트*/
.palette-text {
  color: #747272;
}
</style>
