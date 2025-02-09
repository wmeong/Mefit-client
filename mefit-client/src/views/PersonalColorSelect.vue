<template>
    <v-container class="pa-5" fluid>
        <v-row justify="center">
            <div class="character-info-banne pb-14">
                <div class="character-info-background">
                    <h1 class="character-info-title">Personal Color</h1>
                </div>
            </div>
            <v-col cols="12" class="text-center"> </v-col>
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
.character-info-banner {
    position: relative;
    background: #ffc0cb;
    overflow: hidden;
    padding: 4px 10px;
    border-radius: 20px;
    box-shadow: none;
}

.character-info-background {
    position: relative;
    background: #ffc0cb;
    padding: 15px;
    border-radius: 20px;
}

.character-info-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ffffff;
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

.page-title {
    font-size: 1.8rem;
    font-weight: bold;
    color: #4c4c4c;
    margin-bottom: 30px;
}

.season-grid {
    display: grid;
    grid-template-columns: 200px 200px;
    gap: 15px;
    justify-content: center;
    width: auto;
    margin: 0 auto;
}

.season-item {
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s;
}

.season-item:hover {
    transform: scale(1.05);
}

.spring {
    background-color: #ffc1cc;
    color: #fff;
}

.summer {
    background-color: #b3e5fc;
    color: #fff;
}

.fall {
    background-color: #d7a97b;
    color: #fff;
}

.winter {
    background-color: #673ab7;
    color: #fff;
}
</style>
