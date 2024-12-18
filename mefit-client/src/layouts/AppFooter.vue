<template>
  <footer>
    <p>copyRight Hazi</p>
  </footer>
</template>

<script>
export default {
  name: "AppFooter"
}
</script>

<style scoped>
footer {
  border-top: 1px solid #35495e;
  text-align: center;
  font-size: 16px;
  color: #41b883;
  margin: 50px 0 0 0;
  padding: 10px 0;
}

@media (max-width: 768px) {
  footer {
    font-size: 12px; /* 글자 크기 줄이기 */
    margin: 10px 0 0 0; /* 위쪽 여백 줄이기 */
    padding: 5px 0; /* 패딩 줄이기 */
  }
}

</style>
