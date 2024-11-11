<template>
  <div class="home-container">
    <h2>닉네임을 입력하세요</h2>
    <div class="search-bar">
      <button class="search-icon" @click="search">
        🔎
      </button>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        v-model="searchQuery"
        @keydown.enter="search"
      />
    </div>

    <!-- 인기 캐릭터 리스트 -->
    <v-card class="ranking-card mt-5">
      <v-card-title class="text-center">🌟 인기 캐릭터 🌟</v-card-title>
      <v-divider></v-divider>
      <v-list dense class="character-list">
        <v-list-item
          v-for="(character, index) in popularCharacters"
          :key="index"
          class="character-item"
          @click="selectCharacter(character.characterName)"
        >
          <v-list-item-avatar class="avatar-container">
            <v-img 
              :src="character.characterImage" 
              alt="character avatar"
              max-width="90"
              max-height="90"
          ></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ index + 1 }}. {{ character.characterName }}</v-list-item-title>
            <v-list-item-subtitle>
              Lv.{{ character.characterLevel }} {{ character.characterClass }} - {{ character.worldName }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-btn text @click="loadMoreCharacters">더 보기</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      searchQuery: "", // 검색어 저장
      popularCharacters: [], // 인기 캐릭터 리스트
    };
  },
  methods: {
    search() {
      if (this.searchQuery) {
        this.$router.push({ name: "CharacterInfo", query: { q: this.searchQuery } });
      }
    },
    async fetchPopularCharacters() {
      try {
        const response = await axios.get("http://localhost:8081/api/characters/popular?limit=10");
        console.log(response.data);

        // 데이터 구조에 맞게 매핑
        this.popularCharacters = response.data.map(character => ({
          characterName: character.character_name,
          characterLevel: character.character_level,
          characterClass: character.character_class,
          worldName: character.world_name,
          characterImage: character.character_image,
        }));
      } catch (error) {
        console.error("Failed to fetch popular characters:", error);
      }
    },
    loadMoreCharacters() {
      // 추가 데이터를 로드할 수 있는 경우, 여기에 스크롤 페이징 로직 추가
    },
    selectCharacter(name) {
      this.searchQuery = name;
      this.search();
    }
  },
  created() {
    this.fetchPopularCharacters(); // 컴포넌트 생성 시 인기 캐릭터 목록 가져오기
  },
};
</script>

<style scoped>
.home-container {
  text-align: center;
  margin-top: 30px;
}

h2 {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.search-bar {
  display: flex;
  align-items: center;
  border: 2px solid #ffccff;
  border-radius: 20px;
  padding: 8px 12px;
  width: 300px;
  margin: 0 auto;
  box-shadow: 0 0 8px #ffccff;
  transition: box-shadow 0.3s ease;
  background-color: #fff5ff;
}

.search-bar input {
  border: none;
  outline: none;
  font-size: 14px;
  flex: 1;
  background: none;
}

.search-bar input::placeholder {
  color: #ff88aa;
}

.ranking-card {
  max-width: 350px;
  margin: 20px auto;
  border-radius: 12px;
  background-color: #fff5ff;
  box-shadow: 0 0 10px #ffccff;
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #ff88aa #fff5ff;
}

.ranking-card::-webkit-scrollbar {
  width: 6px;
}

.ranking-card::-webkit-scrollbar-thumb {
  background-color: #ff88aa;
  border-radius: 6px;
}

.character-item {
  cursor: pointer;
}

.character-item:hover {
  background-color: #ffebf5;
}

.avatar-container {
  display: flex;
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
}

.avatar-image {
  border-radius: 50%; /* 둥근 모양으로 표시 */
}

.v-list-item-avatar img {
  border-radius: 50%;
}

.v-list-item-title {
  font-size: 13px;
  font-weight: bold;
  color: #ff88aa;
}

.v-list-item-subtitle {
  font-size: 11px;
  color: #cc66aa;
}

.v-btn {
  color: #ff88aa;
  font-weight: bold;
}
</style>
