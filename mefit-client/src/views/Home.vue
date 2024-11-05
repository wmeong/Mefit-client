<template>
  <div class="home-container">
    <h2>닉네임을 입력하세요</h2>
    <div class="search-bar">
         <button class="search-icon" @click="search">
        🔎
      </button>
      <i class="fas fa-search"></i>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        v-model="searchQuery"
        @keydown.enter="search"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      searchQuery: "", // 검색어 저장
    };
  },
  methods: {
    search() {
      if (this.searchQuery) {
        this.$router.push({ name: "CharacterInfo", query: { q: this.searchQuery } });
      }
    },
  },
};
</script>

<style scoped>
.home-container {
  text-align: center;
  margin-top: 50px;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

/* 검색바 스타일 */
.search-bar {
  display: flex;
  align-items: center;
  border: 2px solid #b3cee7; /* 보라색 테두리 */
  border-radius: 30px;
  padding: 10px 15px;
  width: 400px;
  margin: 0 auto;
  box-shadow: 0 0 8px #b3cee7; /* 보라색 빛나는 효과 */
  transition: box-shadow 0.3s ease;
}

.search-bar i {
  font-size: 18px;
  margin-right: 10px;
}

.search-bar input {
  border: none;
  outline: none;
  font-size: 18px;
  flex: 1;
}

.search-bar input::placeholder {
  color: #aaa; /* 플레이스홀더 색상 */
}
</style>
