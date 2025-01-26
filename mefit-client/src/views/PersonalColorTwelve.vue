<template>
  <v-container>
    <h2 class="text-center">{{ colorName }}</h2>
    <p>여기에 {{ colorName }} 관련 데이터를 표시하세요.</p>
  </v-container>
</template>

<script>
export default {
  props: ["color"], // 라우터에서 전달된 color 파라미터
  computed: {
    colorName() {
      return decodeURIComponent(this.color); // URL에서 인코딩된 값을 디코딩
    },
  },
};
</script>

<style scoped>
h2 {
  margin-top: 20px;
  font-size: 2rem;
}
</style>
