<template>
  <div class="ranking-container" v-if="Object.keys(rankings).length > 0">
    <div v-for="(season, index) in seasons" :key="season" class="season-section">
      <!-- 계절 타이틀 -->
      <div class="season-header">
        <h2 class="season-title">{{ season }} 톤 Top 5</h2>
      </div>

      <!-- 순위 목록 -->
      <div class="season-column" :class="`season-bg-${index}`">
        <div v-for="(rank, idx) in rankings[season] || []" :key="rank.characterImage" class="rank-item">
          <div class="rank-badge">{{ idx + 1 }}</div>
          <img :src="rank.characterImage" alt="캐릭터 이미지" class="rank-image" />
          <span class="character-name">{{ rank.totalVotes }} votes</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "SeasonRanking",
  data() {
    return {
      seasons: ["봄", "여름", "가을", "겨울"],
      rankings: {}, // 계절별 순위 데이터를 저장할 객체
    };
  },
  methods: {
    async fetchRankings() {
      for (const season of this.seasons) {
        try {
          const response = await axios.get("/api/personal/rank", {
            params: { season },
          });
          console.log(`${season} 데이터 응답:`, response.data); // 응답 확인 로그
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

/* 계절 섹션 스타일 */
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
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

/* 계절별 컬러 */
.season-bg-0 {
  background-color: #ffe5ec; /* 봄 */
}

.season-bg-1 {
  background-color: #e0f7fa; /* 여름 */
}

.season-bg-2 {
  background-color: #ffedd5; /* 가을 */
}

.season-bg-3 {
  background-color: #e3f2fd; /* 겨울 */
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
  background: #ff6b6b;
  color: #fff;
  font-size: 0.9rem;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
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

/* 반응형 스타일 */
@media (max-width: 768px) {
  .ranking-container {
    gap: 20px;
  }

  .season-section {
    width: 160px;
  }

  .rank-image {
    width: 70px;
    height: 70px;
  }

  .rank-badge {
    font-size: 0.8rem;
  }

  .character-name {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .season-section {
    width: 100%;
    max-width: 300px;
  }

  .rank-image {
    width: 60px;
    height: 60px;
  }

  .rank-badge {
    font-size: 0.7rem;
  }

  .character-name {
    font-size: 0.7rem;
  }
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
</style>
