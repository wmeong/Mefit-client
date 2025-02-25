<template>
    <div class="home-container">
        <h2>닉네임을 입력하세요</h2>
        <div class="search-bar">
            <button class="search-icon" @click="search">🔎</button>
            <input type="text" placeholder="검색어를 입력하세요" :value="searchQuery" @input="updateQuery"
                @keydown.enter.prevent="search" />
        </div>

        <!-- 인기 캐릭터 리스트 -->
        <v-card class="ranking-card mt-5">
            <v-card-title class="text-center">🌟 인기 캐릭터 🌟</v-card-title>
            <v-divider></v-divider>
            <v-list dense class="character-list">
                <v-list-item v-for="(character, index) in popularCharacters" :key="index" class="character-item"
                    @click="selectCharacter(character.characterName)">
                    <v-list-item-avatar class="avatar-container">
                        <v-img :src="character.characterImage" alt="character avatar" max-width="90"
                            max-height="90"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ index + 1 }}.
                            {{ character.characterName }}</v-list-item-title>
                        <v-list-item-subtitle>
                            Lv.{{ character.characterLevel }}
                            {{ character.characterClass }} -
                            {{ character.worldName }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card>

        <!-- 공통 알림 팝업 -->
        <CustomAlert v-if="showAlert" :visible="showAlert" title="알림" message="존재하지 않는 캐릭터입니다."
            @close="showAlert = false" />
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
                    `http://localhost:8081/api/characters/ocid?name=${encodeURIComponent(trimmedQuery)}`
                );
                if (response.status === 200) {
                    this.$router.push({ name: "CharacterInfo", query: { q: trimmedQuery } });
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
                    "http://localhost:8081/api/characters/popular?limit=10"
                );

                // 데이터 구조에 맞게 매핑
                this.popularCharacters = response.data.map((character) => ({
                    characterName: character.character_name,
                    characterLevel: character.character_level,
                    characterClass: character.character_class,
                    worldName: character.world_name,
                    characterImage:
                        character.character_image ||
                        "https://via.placeholder.com/150", // 디폴트 이미지 추가
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
    max-height: 600px;
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
</style>
