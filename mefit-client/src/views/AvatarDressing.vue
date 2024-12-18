<template>
    <div class="avatar-container">
        <img :src="avatarBase" alt="Avatar Base" class="avatar-base" />
        
        <!-- 아이템 (예: 모자, 옷 등) -->
        <img v-if="selectedItems.hat" :src="selectedItems.hat" alt="Hat" class="item item-hat" />
        <img v-if="selectedItems.clothing" :src="selectedItems.clothing" alt="Clothing" class="item item-clothing" />

        <div class="item-selection">
            <h2>Select Items</h2>
            <div v-if="items.hats">
                <h3>Hats</h3>
                <div v-for="hat in items.hats" :key="hat.id">
                    <button @click="selectItem('hat', hat.image_url)">
                        <img :src="hat.image_url" alt="Hat" class="thumbnail" />
                    </button> 
                </div>
            </div>

            <div v-if="items.clothing">
                <h3>Clothing</h3>
                <div v-for="clothing in items.clothing" :key="clothing.id">
                    <button @click="selectItem('clothing', clothing.image_url)">
                        <img :src="clothing.image_url" alt="Clothing" class="thumbnail" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";

export default {
    name: "AvatarDressing",
    setup() {
        // 아바타 기본 이미지
        const avatarBase = "path/to/avatar_base.png"; // 실제 API로 받은 아바타 이미지로 대체 가능

        // 선택된 아이템
        const selectedItems = ref({
            hat: null,
            clothing: null,
        });

        // 아이템 목록
        const items = ref({
            hats: [],
            clothing: [],
        });

        // 아이템 선택 함수
        const selectItem = (type, itemPath) => {
            selectedItems.value[type] = itemPath;
        };

        // API에서 아이템 불러오기
        const fetchItems = async () => {
            try {
                const hatsResponse = await axios.get("http://localhost:8081/api/items/hats");
                const clothingResponse = await axios.get("http://localhost:8081/api/items/clothing");

                items.value.hats = hatsResponse.data;
                items.value.clothing = clothingResponse.data;
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        // 컴포넌트가 마운트되면 API로 아이템 목록 불러오기
        onMounted(() => {
            fetchItems();
        });

        return {
            avatarBase,
            selectedItems,
            items,
            selectItem,
        };
    },
};
</script>

<style scoped>
.avatar-container {
    position: relative;
    width: 150px;
    height: 200px;
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
    width: 70px;
    height: auto;
}

.item-hat {
    top: 10px;
    left: 25px;
    z-index: 2;
}

.item-clothing {
    top: 100px;
    left: 40px;
    z-index: 2;
}

.item-selection {
    margin-top: 20px;
}

.thumbnail {
    width: 50px;
    height: 50px;
    cursor: pointer;
}
</style>
