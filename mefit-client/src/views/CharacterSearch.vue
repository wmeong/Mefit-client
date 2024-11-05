<template>
    <div>
        <h1>Character Search</h1>
        <input v-model="characterName" placeholder="Enter character name" />
        <button @click="searchAndSaveCharacter">Search & Save</button>

        <div v-if="character">
            <h2>Character Info</h2>
            <p><strong>Name:</strong> {{ character.character_name }}</p>
            <p><strong>World:</strong> {{ character.world_name }}</p>
            <p><strong>Gender:</strong> {{ character.character_gender }}</p>
            <p><strong>Class:</strong> {{ character.character_class }}</p>
            <p><strong>Level:</strong> {{ character.character_level }}</p>
            <p><strong>Guild:</strong> {{ character.character_guild_name }}</p>
            <img :src="character.character_image" alt="Character Image" />
           
        </div>

        <p v-if="message">{{ message }}</p>
    </div>
 
</template>

<script>
import axios from "axios";
import { ref } from "vue";

export default {
    data() {
        return {
            characterName: "", // 검색할 캐릭터 이름
            character: {}, // 검색된 캐릭터 정보 저장
            message: "", // 결과 메시지
            items: ref([])
        };
    },
    methods: {
        async searchAndSaveCharacter() {
            try {
                // ocid조회 + 회원정보 조회 + 조회수 저장
                const ocidResponse = await axios.get(
                    `http://localhost:8081/api/characters/ocid`,
                    { params: { name: this.characterName } } // 쿼리 파라미터 전달
                );
                this.character = ocidResponse.data;
            } catch (error) {
                console.error(error);
                this.message = "An error occurred while saving the character.";
            }
        },
    },

    
};
</script>

<style scoped>
h1 {
    color: #42b983;
}
img {
    width: 200px;
    height: auto;
    margin-top: 10px;
}




.avatar-container {
    position: relative;
    width: 150px;  /* 아바타 이미지 너비에 맞게 설정 */
    height: 200px; /* 아바타 이미지 높이에 맞게 설정 */
}

.avatar-base {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.item {
    position: absolute;
    width: 70px; /* 아이템 크기에 맞게 설정 */
    height: auto;
}

.item-hat {
    top: 10px; /* 모자 위치 */
    left: 25px;
    z-index: 2; /* 아바타 위에 표시되도록 z-index 설정 */
}

.item-clothing {
    top: 100px; /* 옷 위치 */
    left: 40px;
    z-index: 2;
}

</style>
