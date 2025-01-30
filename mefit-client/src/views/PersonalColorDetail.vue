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
        <h4>
          🌟 Character Showcase 🌟
          <v-btn icon class="refresh-btn" @click="refreshCharacters">
            <v-icon color="#ff88aa">mdi-refresh</v-icon>
          </v-btn>
        </h4>
      </v-col>
      <v-col
        v-for="(avatar, index) in avatars"
        :key="index"
        cols="3"
        class="text-center avatar-container"
        @click="openPopup(avatar.characterImage)"
      >
        <!-- 캐릭터 이미지 -->
        <img
          :src="avatar.characterImage"
          alt="Character Avatar"
          class="avatar-img"
        />
        <!-- 하트 버튼 -->
        <div class="vote-container">
          <v-icon
            class="heart-icon"
            :style="{
              color: votedCharacters.has(avatar.characterImage)
                ? '#FF0000'
                : '#FFB6C1',
            }"
            @click="voteForAvatar($event, avatar)"
          >
            {{
              votedCharacters.has(avatar.characterImage)
                ? "mdi-heart"
                : "mdi-heart-outline"
            }}
          </v-icon>
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

  <!-- ✅ 공통 알림 팝업 추가 (v-container 밖에서 전체 화면 적용) -->
  <CustomAlert
    v-if="showAlert"
    :visible="showAlert"
    title="알림"
    :message="alertMessage"
    @close="showAlert = false"
    @confirm="onPopupConfirm"
  />
</template>

<script>
import axios from "axios";
import CharacterInfoPopup from "./CharacterInfoPopup.vue";
import CustomAlert from "@/components/CustomAlert.vue";

export default {
  components: { CharacterInfoPopup, CustomAlert },
  props: ["season"],
  data() {
    return {
      avatars: [], //characterImage 데이터를 저장할 배열
      popupVisible: false, // 팝업 표시 상태
      selectedCharacter: null, // 선택된 캐릭터 데이터
      votedCharacters: new Set(), // ✅ 투표한 캐릭터 저장
      showAlert: false, // ✅ 공통 팝업 표시 여부
      alertMessage: "", // ✅ 공통 팝업 메시지
      refreshCount: 0, // ✅ 새로고침 횟수 카운트 추가
      maxRefreshAttempts: 5, // ✅ 최대 5번까지 재시도 가능
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
        const response = await axios.get(
          "http://localhost:8081/api/personal/season",
          {
            params: { season: this.seasonTitle.trim() }, // ✅ 불필요한 공백 제거
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
        // ✅ 팝업 메시지 및 상태 설정
        this.alertMessage = "이 캐릭터의 투표를 취소하시겠습니까?";
        this.showAlert = true;

        // ✅ 팝업 확인 버튼을 눌렀을 때 실행할 로직
        this.onPopupConfirm = async () => {
          try {
            await axios.delete("http://localhost:8081/api/personal/vote", {
              params: { characterImage: avatar.characterImage },
            });

            this.votedCharacters.delete(avatar.characterImage); // 투표 취소 처리
            console.log("✅ 투표 취소 성공:", avatar.characterImage);
          } catch (error) {
            console.error("투표 취소 중 오류 발생:", error);
          } finally {
            this.showAlert = false; // 팝업 닫기
          }
        };

        return;
      }

      // 새로운 투표 처리
      if (!avatar || !avatar.characterImage || !avatar.personalColor) {
        console.error("❌ 유효하지 않은 캐릭터 데이터:", avatar);
        return;
      }

      try {
        await axios.post("http://localhost:8081/api/personal/vote", null, {
          params: {
            characterImage: avatar.characterImage,
            personalColor: avatar.personalColor,
          },
        });

        this.votedCharacters.add(avatar.characterImage);
        console.log("✅ 투표 성공:", avatar.characterImage);
      } catch (error) {
        console.error("투표 중 오류 발생:", error);
      }
    },
    async refreshCharacters() {
      try {
        console.log("🔄 새로고침 시도 중...");

        // ✅ 기존 데이터를 백업
        const previousAvatars = this.avatars.map(
          (avatar) => avatar.characterImage
        );

        // ✅ 새로운 데이터 요청
        const response = await axios.get(
          "http://localhost:8081/api/personal/season",
          {
            params: { season: this.seasonTitle },
          }
        );

        // ✅ 받은 데이터의 캐릭터 이미지 목록 추출
        const newAvatars = response.data.map((avatar) => avatar.characterImage);

        // ✅ 변경된 캐릭터 개수 확인
        const changedThreshold = 3; // ✅ 최소 3개 이상 캐릭터가 변경되면 적용
        const differentCount = newAvatars.filter(
          (img) => !previousAvatars.includes(img)
        ).length;

        if (differentCount < changedThreshold) {
          console.warn(
            `⚠ 변경된 캐릭터 수 ${differentCount}. 최소 ${changedThreshold}개 이상 달라야 새로고침 적용. (시도 횟수: ${
              this.refreshCount + 1
            })`
          );

          // ✅ 최대 요청 횟수 초과 시 중단
          if (this.refreshCount >= this.maxRefreshAttempts) {
            console.error(
              "🚨 새로고침 최대 횟수 초과. 더 이상 요청하지 않습니다."
            );
            return;
          }

          this.refreshCount++; // ✅ 요청 횟수 증가
          setTimeout(() => this.refreshCharacters(), 500); // ✅ 0.5초 후 재요청
          return;
        }

        // ✅ 새 데이터 적용 및 카운트 초기화
        this.avatars = response.data;
        this.refreshCount = 0; // ✅ 정상 요청되면 카운트 초기화
        console.log("✅ 새 캐릭터 목록 갱신 완료!", this.avatars);
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
      }
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
