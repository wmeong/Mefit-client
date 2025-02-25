<template>
    <v-container class="pa-5" fluid>
        <v-row justify="center">
            <div class="character-info-banner">
                <div class="character-info-background">
                    <h1 class="character-info-title">
                       Personal Color
                    </h1>
                </div>
            </div>
            <v-col cols="12" class="text-center">
                <p class="description">
                    계절별 퍼스널 컬러를 선택하고, 나에게 어울리는 색상을 확인해보세요!
                     <img src="@/assets/rainbowpaint.webp" alt="Yellow Star" class="yellow-star-icon">
                </p>
            </v-col>
        </v-row>
        <div class="season-grid">
            <div class="season-item spring" @click="navigateToSeason('spring')">
                봄
            </div>
            <div class="season-item summer" @click="navigateToSeason('summer')">
                여름
            </div>
            <div class="season-item fall" @click="navigateToSeason('fall')">
                가을
            </div>
            <div class="season-item winter" @click="navigateToSeason('winter')">
                겨울
            </div>
        </div>
    </v-container>
</template>

<script>
export default {
    methods: {
        navigateToSeason(season) {
            this.$router.push({
                name: "PersonalColorDetail",
                query: { season },
            });
        },
    },
};
</script>

<style scoped>
/* 배너 스타일 */
.character-info-banner {
  position: relative;
  background: #E6D6FF; /* 연보라 */
  overflow: hidden;
  padding: 4px 10px;
  border-radius: 20px;
  box-shadow: none;
  margin-top: 20px;
}

.character-info-background {
  background: #E6D6FF; /* 연보라 */
  padding: 15px;
  border-radius: 20px;
}

.character-info-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff8f0;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(193, 101, 255, 0.8),
    0 0 40px rgba(255, 223, 0, 0.6), 0 0 60px rgba(255, 223, 0, 0.4);
  letter-spacing: 5px;
}

/* shimmer 효과 */
.character-info-background::before {
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

/* 설명 문구 */
.description {
    font-size: 1.1rem;
    font-weight: 500;
    color: #4a3d5c;
    margin-bottom: 20px;
}

/* 계절 선택 버튼 스타일 */
.season-grid {
    display: grid;
    grid-template-columns: repeat(2, 220px);
    gap: 25px;
    justify-content: center;
    width: auto;
    margin: 0 auto;
}

.season-item {
    width: 220px;
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    font-size: 1.4rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.12);
    text-transform: uppercase;
    letter-spacing: 1px;
    text-align: center;
    font-family: "Pretendard", sans-serif;
}

/* 버튼 호버 효과 */
.season-item:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.2);
}

/* 클릭 효과 */
.season-item:active {
    transform: scale(0.95);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

/* 봄웜 */
.spring {
    background: linear-gradient(135deg, #FFD6E0, #FFC1CC);
    color: #FFFFFF;
}

/* 여름쿨 */
.summer {
    background: linear-gradient(135deg, #D4F1FF, #A8E4FF);
    color: #FFFFFF;
}

/* 가을웜 */
.fall {
    background: linear-gradient(135deg, #F2D1A0, #E6B98D);
    color: #FFFFFF;
}

/* 겨울쿨 */
.winter {
    background: linear-gradient(135deg, #D8C5FF, #B5A2FF);
    color: #FFFFFF;
}

.yellow-star-icon {
    width: 24px;
    height: 24px;
    margin-left: 5px;
    vertical-align: middle;
}


/* 반응형 스타일 */
@media (max-width: 768px) {
    .season-grid {
        grid-template-columns: repeat(2, 160px);
        gap: 15px;
    }

    .season-item {
        width: 160px;
        height: 160px;
        font-size: 1.2rem;
    }

    .character-info-banner {
        padding: 10px;
    }

    .character-info-title {
        font-size: 1.5rem;
        letter-spacing: 1px;
    }

    .description {
        font-size: 1rem;
    }
}
</style>
