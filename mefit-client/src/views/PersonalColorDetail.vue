<template>
  <v-container class="pa-5" fluid>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <!-- 계절 제목 표시 -->
        <h3 class="page-title">{{ seasonTitle }}</h3>
      </v-col>
    </v-row>

    <!-- 하위 색상 표시 -->
    <v-row justify="center" class="sub-tone-row">
      <v-col
        v-for="type in subTones"
        :key="type.name"
        cols="3"
        class="text-center sub-tone-item"
        @click="navigateToPersonalColorPage(type.name)"
      >
        <div class="tone-circle" :style="{ backgroundColor: type.color }"></div>
        <p class="tone-label">{{ type.name }}</p>
      </v-col>
    </v-row>

    <!-- 캐릭터 아바타 그리드 -->
    <v-row justify="center" class="avatar-grid">
      <v-col cols="12" class="text-center">
        <h4>🌟 Character Showcase 🌟</h4>
      </v-col>
      <v-col
        v-for="(characterImage, index) in avatars"
        :key="index"
        cols="3"
        class="text-center avatar-container"
        @click="openPopup(characterImage)"
      >
        <!-- 캐릭터 이미지 -->
        <img :src="characterImage" alt="Character Avatar" class="avatar-img" />
        <!-- 하트 버튼 -->
        <div class="vote-container">
          <v-icon
            class="heart-icon"
            :style="{ color: '#FFB6C1' }"
            @click.stop="voteForAvatar(index)"
            >mdi-heart-outline</v-icon
          >
        </div>
      </v-col>
    </v-row>

    <!-- CharacterInfoPopup 컴포넌트 -->
    <CharacterInfoPopup
      v-if="popupVisible"
      :model-value="popupVisible"
      @update:model-value="popupVisible = $event"
      :character="selectedCharacter"
    />
  </v-container>
</template>

<script>
import axios from "axios";
import CharacterInfoPopup from "./CharacterInfoPopup.vue";

export default {
  components: { CharacterInfoPopup },
  props: ["season"],
  data() {
    return {
      avatars: [], //characterImage 데이터를 저장할 배열
      popupVisible: false, // 팝업 표시 상태
      selectedCharacter: null, // 선택된 캐릭터 데이터
    };
  },
  computed: {
    // 상단 타이틀 표시
    seasonTitle() {
      const season = this.$route.query.season || this.season; // query 또는 props에서 가져오기
      const titles = {
        spring: "봄웜",
        summer: "여름쿨",
        fall: "가을웜",
        winter: "겨울쿨",
      };
      return titles[season];
    },
    // 하위 톤 목록
    subTones() {
      const tones = {
        봄웜톤: [
          { name: "라이트", color: "#FFEBE8" },
          { name: "브라이트", color: "#FFC1CC" },
          { name: "트루", color: "#FFB7A5" },
        ],
        여름쿨톤: [
          { name: "라이트", color: "#D4F1F9" },
          { name: "브라이트", color: "#A3D8F4" },
          { name: "뮤트", color: "#91C7D6" },
        ],
        가을웜톤: [
          { name: "뮤트", color: "#D7A97B" },
          { name: "스트롱", color: "#B97543" },
          { name: "딥", color: "#8A5539" },
        ],
        겨울쿨톤: [
          { name: "브라이트", color: "#C5B3E7" },
          { name: "스트롱", color: "#7E57C2" },
          { name: "다크", color: "#512DA8" },
        ],
      };
      // 현재 seasonTitle에 해당하는 하위 톤 반환
      const baseTones = tones[this.seasonTitle + "톤"] || []; // "봄웜톤" 등으로 찾기
      return baseTones.map((tone) => ({
        name: `${this.seasonTitle} ${tone.name}`, // 시즌 타이틀과 톤 이름 이어 붙임
        color: tone.color,
      }));
    },
  },
  methods: {
    async fetchSeasonData() {
      try {
        // 백엔드 API 호출하여 characterImage 데이터 가져오기
        const response = await axios.get(
          "http://localhost:8081/api/personal/season",
          {
            params: { season: this.seasonTitle },
          }
        );
        this.avatars = response.data; // characterImage 데이터 저장
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
      }
    },
    voteForAvatar(index) {
      // 투표 수 증가 로직
      console.log(`캐릭터 ${index + 1}에 투표했습니다.`);
    },
    navigateToPersonalColorPage(toneName) {
      // 클릭한 하위 톤으로 이동
      this.$router.push({
        path: `/personal-color-twelve/${encodeURIComponent(toneName)}`,
      });
    },
    openPopup(characterImage) {
      console.log("🔍 클릭한 캐릭터 이미지 URL:", characterImage); // << 클릭한 이미지 확인

      this.selectedCharacter = { image: characterImage };
      this.popupVisible = true;
    },
  },
  mounted() {
    // 컴포넌트가 마운트될 때 데이터 가져오기
    this.fetchSeasonData();
  },
};
</script>

<style scoped>
/* 페이지 타이틀 */
.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #4c4c4c;
  margin-bottom: 30px;
}

/* 하위 색상 그리드 */
.sub-tone-row {
  margin-bottom: 40px;
}
.sub-tone-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.tone-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease; /* 하버 효과와 클릭 효과를 위한 트랜지션 */
  cursor: pointer;
}
/* 하버 효과 */
.tone-circle:hover {
  transform: scale(1.1); /* 약간 확대 */
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2); /* 그림자 강조 */
}
/* 클릭 효과 */
.tone-circle:active {
  transform: scale(0.95); /* 약간 축소 */
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1); /* 그림자 약화 */
}
.tone-label {
  font-size: 1.2rem;
  font-weight: bold;
  color: #4c4c4c;
}

/* 아바타 그리드 */
.avatar-grid {
  margin-top: 30px;
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
}

/* 투표 컨테이너 */
.vote-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}
.heart-icon {
  cursor: pointer;
  font-size: 32px; /* 아이콘 크기 */
  transition: transform 0.2s ease;
}
.heart-icon:hover {
  transform: scale(1.2); /* 호버 시 확대 효과 */
}
</style>
