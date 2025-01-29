<template>
  <v-container class="pa-5" fluid>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h3 class="page-title">🌸 Personal Color 🌿</h3>
      </v-col>
    </v-row>
    <div class="season-grid">
      <div class="season-item spring" @click="navigateToSeason('spring')">봄</div>
      <div class="season-item summer" @click="navigateToSeason('summer')">여름</div>
      <div class="season-item fall" @click="navigateToSeason('fall')">가을</div>
      <div class="season-item winter" @click="navigateToSeason('winter')">겨울</div>
    </div>
  </v-container>
</template>

<script>
export default {
  methods: {
   navigateToSeason(season) {
  this.$router.push({ name: 'PersonalColorDetail', query: { season } });
}
  },
};
</script>

<style scoped>
.page-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #4c4c4c;
  margin-bottom: 30px;
}

.season-grid {
  display: grid;
  grid-template-columns: 200px 200px; /* 가로 크기를 고정 */
  gap: 15px; /* 간격 유지 */
  justify-content: center; /* 중앙 정렬 */
  width: auto; /* 컨테이너 너비를 자동으로 맞춤 */
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
