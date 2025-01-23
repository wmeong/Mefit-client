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
        v-for="n in 12"
        :key="n"
        cols="3"
        class="text-center avatar-container"
      >
        <img
          src="https://via.placeholder.com/100"
          alt="Avatar Placeholder"
          class="avatar-img"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ['season'],
  computed: {
    // 상단 타이틀 표시
    seasonTitle() {
      const season = this.$route.query.season || this.season; // query 또는 props에서 가져오기
      const titles = {
        spring: '봄웜톤',
        summer: '여름쿨톤',
        fall: '가을웜톤',
        winter: '겨울쿨톤',
      };
      return titles[season];
    },
    // 하위 톤 목록
    subTones() {
      const tones = {
        봄웜톤: [
          { name: '라이트', color: '#FFEBE8' },
          { name: '브라이트', color: '#FFC1CC' },
          { name: '트루', color: '#FFB7A5' },
        ],
        여름쿨톤: [
          { name: '라이트', color: '#D4F1F9' },
          { name: '브라이트', color: '#A3D8F4' },
          { name: '뮤트', color: '#91C7D6' },
        ],
        가을웜톤: [
          { name: '뮤트', color: '#D7A97B' },
          { name: '스트롱', color: '#B97543' },
          { name: '딥', color: '#8A5539' },
        ],
        겨울쿨톤: [
          { name: '브라이트', color: '#C5B3E7' },
          { name: '스트롱', color: '#7E57C2' },
          { name: '다크', color: '#512DA8' },
        ],
      };
      // 현재 seasonTitle에 해당하는 하위 톤 반환
      return tones[this.seasonTitle] || [];
    },
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
  justify-content: center;
}
.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
