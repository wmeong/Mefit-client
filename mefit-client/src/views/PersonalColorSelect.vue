<template>
    <v-container class="pa-5" fluid>
        <v-row justify="center">
            <div class="character-info-banner pb-14">
                <div class="character-info-background">
                    <h1 class="character-info-title">
                       🌈 당신의 퍼스널 컬러를 찾아보세요! 🎨
                    </h1>
                </div>
            </div>
            <v-col cols="12" class="text-center">
                <p class="description">
                    계절별 퍼스널 컬러를 선택하고, 나에게 어울리는 색상을 확인해보세요!
                </p>
            </v-col>
        </v-row>
        <div class="season-grid">
            <div class="season-item spring" @click="navigateToSeason('spring')">
                봄웜
            </div>
            <div class="season-item summer" @click="navigateToSeason('summer')">
                여름쿨
            </div>
            <div class="season-item fall" @click="navigateToSeason('fall')">
                가을웜
            </div>
            <div class="season-item winter" @click="navigateToSeason('winter')">
                겨울쿨
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
    background: linear-gradient(135deg, #f9e1e1, #e4d9ff);
    overflow: hidden;
    padding: 15px;
    border-radius: 25px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
}

.character-info-background {
    text-align: center;
}

.character-info-title {
    font-size: 1.8rem;
    font-weight: bold;
    color: #ffffff;
    text-transform: uppercase;
    text-shadow: 0 0 10px rgba(255, 182, 193, 0.6),
        0 0 20px rgba(173, 216, 230, 0.5), 0 0 30px rgba(147, 112, 219, 0.4);
    letter-spacing: 2px;
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
    background: linear-gradient(135deg, #FFCBCB, #FFA5A5);
    color: #5A3D3D;
}

/* 여름쿨 */
.summer {
    background: linear-gradient(135deg, #AEE3FF, #7CC9F8);
    color: #1F4A68;
}

/* 가을웜 */
.fall {
    background: linear-gradient(135deg, #E8B77E, #D69A5E);
    color: #5A3D2E;
}

/* 겨울쿨 */
.winter {
    background: linear-gradient(135deg, #9278FF, #6A5ACD);
    color: #FFFFFF;
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
