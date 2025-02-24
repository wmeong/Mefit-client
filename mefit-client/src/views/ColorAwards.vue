<template>
  <!-- 최상단 타이틀 -->
  <div class="color-awards-banner">
    <div class="award-background">
      <h1 class="color-awards-title">Color Awards</h1>
    </div>
  </div>
  <!-- 상단 설명 -->
  <div class="color-awards-description">
    🎨 Mefit의 가장 인기 있는 캐릭터 스타일을 확인하세요! 계절별로 가장 많은
    ❤️을 받은 캐릭터들이 여기에 모였습니다. 어떤 스타일이 가장 사랑받았는지
    확인하고, 나만의 컬러 스타일을 찾아보세요! 🌟
  </div>

  <!-- 랭킹 컨테이너 -->
  <div class="ranking-container" v-if="Object.keys(rankings).length > 0">
    <div
      v-for="(season, index) in seasons"
      :key="season"
      class="season-section"
    >
      <!-- 계절 타이틀 -->
      <div class="season-header">
        <h2 class="season-title">{{ season }}</h2>
      </div>

      <!-- 순위 목록 -->
      <div class="season-column" :class="`season-bg-${index}`">
        <div
          v-for="(rank, idx) in rankings[season] || []"
          :key="rank.characterImage"
          class="rank-item"
        >
          <div class="rank-badge">{{ idx + 1 }}</div>
          <img
            :src="rank.characterImage"
            alt="캐릭터 이미지"
            class="rank-image"
            @click="openPopup(rank.characterImage)"
          />

          <span class="character-name">🧡 {{ rank.totalVotes }} </span>
        </div>
      </div>
    </div>
  </div>

  <!-- CharacterInfoPopup 컴포넌트 -->
  <CharacterInfoPopup
    v-if="popupVisible"
    :model-value="popupVisible"
    @update:model-value="popupVisible = $event"
    :character="selectedCharacter"
  />
</template>

<script>
import axios from "axios";
import CharacterInfoPopup from "./CharacterInfoPopup.vue";

export default {
  components: { CharacterInfoPopup },
  name: "SeasonRanking",
  data() {
    return {
      seasons: ["봄", "여름", "가을", "겨울"],
      rankings: {}, // 계절별 순위 데이터를 저장할 객체
      popupVisible: false, // 팝업 표시 여부
      selectedCharacter: null, // 선택된 캐릭터 데이터
    };
  },
  methods: {
    async fetchRankings() {
      for (const season of this.seasons) {
        try {
          const response = await axios.get(
            `${process.env.VUE_APP_API_BASE_URL}/api/personal/rank`,
            {
              params: { season },
            }
          );
          if (Array.isArray(response.data) && response.data.length > 0) {
            // Vue 3에서는 객체를 직접 수정하면 됩니다.
            this.rankings[season] = response.data;
          } else {
            console.warn(`${season} 데이터가 비어 있습니다.`);
          }
        } catch (error) {
          console.error(`${season} 데이터 로드 중 오류 발생:`, error);
        }
      }
    },
    openPopup(characterImage) {
      if (!characterImage) {
        console.error("❌ 이미지가 없습니다.");
        return;
      }

      this.selectedCharacter = { image: characterImage }; // 이미지 설정
      this.popupVisible = true; // 팝업 열기
    },
  },
  mounted() {
    this.fetchRankings();
  },
};
</script>
<style scoped>
/* 컨테이너 스타일 */
.ranking-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 40px;
  padding: 20px;
  animation: fadeIn 0.5s ease-in-out;
}

/*상단 텍스트(컬러어워즈)*/
.color-awards-banner {
  text-align: center;
  position: relative;
  margin-bottom: 20px;
  margin-top: 20px;
}

.award-background {
  position: relative;
  background: linear-gradient(90deg, #FFD700, #FFA500);
  overflow: hidden;
  padding: 15px;
  border-radius: 20px;
  box-shadow: none;
}

.color-awards-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(193, 101, 255, 0.8),
    0 0 40px rgba(255, 223, 0, 0.6), 0 0 60px rgba(255, 223, 0, 0.4);
  letter-spacing: 5px;
}

/* shimmer 효과*/
.award-background::before {
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

/* 계절 섹션 */
.season-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  background: #fff;
  border-radius: 20px;
  padding: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.season-section:hover {
  transform: translateY(-10px);
}

/* 계절 제목 */
.season-title {
  font-size: 1.2rem;
  color: #333333b5;
  margin-bottom: 20px;
}

/* 계절별 컬러 */
.season-bg-0 {
  background-color: #ffc1cc9b; /* 봄 */
}

.season-bg-1 {
  background-color: #b3e5fc8b; /* 여름 */
}

.season-bg-2 {
  background-color: #d7a97b82; /* 가을 */
}

.season-bg-3 {
  background-color: #683ab785; /* 겨울 */
}

/* 순위 아이템 */
.rank-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

/* 순위 배지 */
.rank-badge {
  position: absolute;
  top: -10px;
  left: -10px;
  background: #fbfe69;
  color: #716c6ca6;
  font-size: 0.9rem;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
  width: 30px;
  height: 30px;
}

/* 이미지 스타일 */
.rank-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  object-fit: cover;
  transition: transform 0.2s ease;
  cursor: pointer;
}

.rank-image:hover {
  transform: scale(1.1);
}

/* 캐릭터 이름 */
.character-name {
  font-size: 0.9rem;
  font-weight: bold;
  color: #555;
  margin-top: 8px;
}

.color-awards-description {
    text-align: center;
    font-size: 1rem;
    color: #555;
    margin-bottom: 20px;
    font-weight: 500;
    line-height: 1.5;
}

/* 애니메이션 효과 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 애니메이션 효과 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes twinkle {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}


/* 모바일 */
@media (max-width: 768px) {
  .ranking-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 10px !important;
    padding: 0 !important;
  }

  .season-section {
    flex: unset !important; /* flex 비활성화 */
    background: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
    min-width: 55px !important;
    max-width: 85px !important;
    width: 1000px;
  }

  .season-column {
    width: 70px !important;
    border-radius: 8px !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .rank-image {
    width: 70px !important;
    height: 70px !important;
  }
  .rank-badge {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 18px !important;
    height: 18px !important;
    font-size: 0.65rem !important;
    line-height: 18px !important;
  }
  .character-name {
    font-size: 0.6rem !important;
  }
}
</style>
