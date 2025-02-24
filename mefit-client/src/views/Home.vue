<template>
  <div class="home-container">
    <div class="search-bar">
      <input
        type="text"
        placeholder="닉네임을 입력하세요"
        :value="searchQuery"
        @input="updateQuery"
        @keydown.enter.prevent="search"
      />
      <button class="search-button" @click="search">검색</button>
    </div>

    <!-- 인기 캐릭터 리스트 -->
    <v-card class="ranking-card mt-5">
      <v-card-title class="title-container">
        <span class="title">🌟 인기 캐릭터 🌟</span>
        <!-- <v-btn
          icon
          color="grey darken-2"
          class="help-btn mb-1"
          style="width: 20px; height: 20px"
        >
          <v-tooltip bottom>
            <template #activator="{ props }">
              <v-icon v-bind="props" class="help-icon">
                mdi-help-circle-outline
              </v-icon>
            </template>
            <span> 랭킹은 3시간마다 갱신됩니다. </span>
          </v-tooltip>
        </v-btn> -->
      </v-card-title>
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
            <v-list-item-title class="character-name-box">
              {{ index + 1 }} {{ character.characterName }}
            </v-list-item-title>
            <!-- <v-list-item-subtitle>
                            Lv.{{ character.characterLevel }}
                            {{ character.characterClass }} -
                            {{ character.worldName }}
                        </v-list-item-subtitle> -->
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- 공통 알림 팝업 -->
    <CustomAlert
      v-if="showAlert"
      :visible="showAlert"
      title="알림"
      message="존재하지 않는 캐릭터입니다."
      @close="showAlert = false"
    />
  </div>
</template>

<script>
import axios from "axios";
import CustomAlert from "@/components/CustomAlert.vue"; // 공통 알림 컴포넌트

export default {
  name: "Home",
  components: { CustomAlert },
  data() {
    return {
      searchQuery: "", // 검색어 저장
      popularCharacters: [], // 인기 캐릭터 리스트
      showAlert: false, // 알림 팝업 표시 여부
      isSearching: false, // 검색 중 상태 플래그
    };
  },
  methods: {
    updateQuery(event) {
      // 입력값 수동 동기화
      this.searchQuery = event.target.value;
    },

    async search() {
      const trimmedQuery = this.searchQuery.trim();
      if (!trimmedQuery) return;

      this.isSearching = true;
      try {
        const response = await axios.get(
          `${
            process.env.VUE_APP_API_BASE_URL
          }/api/characters/ocid?name=${encodeURIComponent(trimmedQuery)}`
        );
        if (response.status === 200) {
          this.$router.push({
            name: "CharacterInfo",
            query: { q: trimmedQuery },
          });
        } else {
          throw new Error("Character not found");
        }
      } catch (error) {
        console.error("Search failed:", error);
        this.showAlert = true;
      } finally {
        this.isSearching = false;
      }
    },

    /**
     * 인기 캐릭터 목록 가져오기
     */
    async fetchPopularCharacters() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/api/characters/popular?limit=10`
        );
        // 데이터 구조에 맞게 매핑
        this.popularCharacters = response.data.map((character) => ({
          characterName: character.name,
          //characterLevel: character.score,
          //characterClass: "Unknown",
          //worldName: "Unknown",
          characterImage: character.image,
        }));
      } catch (error) {
        console.error("Failed to fetch popular characters:", error);
      }
    },

    /**
     * 인기 캐릭터 클릭 시 CharacterInfo로 이동
     */
    selectCharacter(name) {
      // 캐릭터 이름을 쿼리로 전달하여 CharacterInfo 페이지로 이동
      this.$router.push({
        name: "CharacterInfo",
        query: { q: name },
      });
    },
  },
  created() {
    // 컴포넌트 생성 시 인기 캐릭터 목록 가져오기
    this.fetchPopularCharacters();
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
  border: 2px solid #f8e1ec; /* 연한 핑크로 변경 */
  border-radius: 20px;
  padding: 8px 12px;
  width: 300px;
  margin: 0 auto;
  box-shadow: 0 0 8px #f8e1ec;
  transition: box-shadow 0.3s ease;
  background-color: #fef5f7; /* 연핑크 → 부드러운 살구빛 핑크 */
}

.search-bar input {
  border: none;
  outline: none;
  font-size: 14px;
  flex: 1;
  background: none;
}

.search-bar input::placeholder {
   color: #d685a0; 
}
.search-button {
  background-color: #e6c3e6; /* 연보라색으로 변경 */
  color: white;
  border: none;
  padding: 6px 12px;
  margin-left: 8px;
  border-radius: 15px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.search-button:hover {
  background-color: #ff66a3; /* 진한 핑크 */
}

.ranking-card {
  max-width: 350px;
  margin: 20px auto;
  border-radius: 12px;
  background-color: #faf3f0; /* 크림색 계열로 변경 */
  box-shadow: 0 0 10px #f8e1ec;
  max-height: 600px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #d685a0 #faf3f0;
}

.ranking-card::-webkit-scrollbar {
  width: 6px;
}

.ranking-card::-webkit-scrollbar-thumb {
  background-color: #d685a0;
  border-radius: 6px;
}

.character-item {
  cursor: pointer;
}

.character-item:hover {
   background-color: #fceef1;
}

.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
}


.avatar-image {
  border-radius: 50%;
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

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #ff88aa;
  margin-left: 25px;
  margin-right: 8px;
}

.help-icon {
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}

/* 인기 캐릭터 네모 박스 스타일 */
.character-name-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    min-width: 75px;
    max-width: 100px;
    height: 20px;
    background: #fef5f7; /* 기존보다 부드러운 톤 */
    border: 1.5px solid #d685a0; /* 연한 로즈핑크 */
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #d685a0;
    box-shadow: 1px 1px 0px #d685a0;
    transition: all 0.2s ease-in-out;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: center;
}

/* 호버 효과 (너무 튀지 않게 부드럽게) */
.character-name-box:hover {
    background: #fceef1;
    border-color: #c56e8d;
    transform: scale(1.03);
}


</style>
