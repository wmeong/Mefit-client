<template>
  <div class="ranking-container">
    <div v-for="(season, index) in seasons" :key="season" class="season-section">
      <h2 class="season-title">{{ season }}</h2>
      <div class="season-column" :class="`season-bg-${index}`">
        <div v-for="rank in 5" :key="rank" class="rank-item">
          <span class="rank-number">{{ rank }}</span>
          <img class="rank-image" src="@/assets/slime.png" alt="슬라임 이미지" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SeasonRanking",
  data() {
    return {
      seasons: ["봄", "여름", "가을", "겨울"]
    };
  }
};
</script>

<style scoped>
/* 기본 컨테이너 설정 */
.ranking-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 10px;
  gap: 50px;
}

/* 각 계절 섹션 */
.season-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 160px;
}

/* 계절 제목 */
.season-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 8px;
}

/* 계절별 배경색 */
.season-bg-0 {
  background-color: #FFE4E1; /* 봄 */
}

.season-bg-1 {
  background-color: #E0F7FA; /* 여름 */
}

.season-bg-2 {
  background-color: #FFE4B5; /* 가을 */
}

.season-bg-3 {
  background-color: #E3F2FD; /* 겨울 */
}

/* 계절 컬럼 */
.season-column {
  padding: 15px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 160px;
}

.rank-item {
  position: relative;
  margin-bottom: 15px;
}

/* 순위 번호 */
.rank-number {
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  font-weight: bold;
}

/* 이미지 */
.rank-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid #ddd;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .ranking-container {
    justify-content: center;
    gap: 20px;
  }

  .season-section {
    width: 140px;
  }

  .rank-image {
    width: 60px;
    height: 60px;
  }

  .rank-number {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .season-section {
    width: 100%;
    max-width: 280px;
  }

  .season-column {
    padding: 10px;
  }

  .rank-item {
    margin-bottom: 10px;
  }

  .rank-image {
    width: 50px;
    height: 50px;
  }

  .rank-number {
    font-size: 0.6rem;
  }
}
</style>
