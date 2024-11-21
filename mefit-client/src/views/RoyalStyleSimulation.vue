<template>
  <v-container>
    <v-row class="align-center justify-center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-4 mb-4 elevation-2 modern-card">
          <h2 class="text-center">Royal Style Simulator</h2>
            <v-btn class="ma-2" color="primary" @click="simulate">Simulate</v-btn>
          <p v-if="result" class="text-center mt-4">
            <strong>Result:</strong> {{ result.itemName }}
          </p>
          <v-img
            v-if="result"
            :src="result.imageUrl"
            class="simulation-result-image mx-auto mt-4"
          ></v-img>
        </v-card>
      </v-col>
    </v-row>

    <!-- 인벤토리 스타일 -->
    <v-row class="inventory-grid">
      <v-col
        v-for="(item, index) in inventory"
        :key="index"
        cols="2"
        class="inventory-item"
      >
        <v-img
          :src="item.imageUrl"
          :alt="item.itemName"
          class="item-image"
        ></v-img>
        <p class="item-name">{{ item.itemName }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "RoyalStyleSimulation",
  data() {
    return {
      items: [], // 서버에서 가져온 전체 아이템 목록
      inventory: [], // 인벤토리에 추가된 아이템 목록
      result: null, // 뽑기 결과
    };
  },
  methods: {
    // 서버에서 아이템 목록 가져오기
    async fetchItems() {
      try {
        const response = await axios.get("http://localhost:8081/api/royal-style");
        this.items = response.data.map((item) => ({
          ...item,
          imageUrl: `/assets/images/${encodeURIComponent(
            item.itemName.replace(/ /g, "_").replace(/[^\w]/g, "")
          )}.png`, // 이미지 경로 매핑
        }));
        console.log("Fetched items:", this.items); // 데이터 확인용
      } catch (error) {
        console.error("Failed to fetch items:", error);
        alert("Failed to load items. Please try again later.");
      }
    },
    // 뽑기 시뮬레이션
    async simulate() {
      try {
        const response = await axios.get("http://localhost:8081/api/royal-style/random");
        console.log(response); // 응답 데이터 확인
        if (response.data) {
          const selectedItem = response.data; // 단일 객체로 처리
          console.log("selectedItem:", selectedItem);
          this.result = {
            ...selectedItem,
            imageUrl: `/assets/images/${encodeURIComponent(
              selectedItem.itemName.replace(/ /g, "_").replace(/[^\w]/g, "")
            )}.png`,
          };
          this.inventory.push(this.result); // 인벤토리에 추가
        } else {
          alert("No items found in the simulation.");
        }
      } catch (error) {
        console.error("Failed to simulate:", error);
        alert("Failed to simulate. Please try again later.");
      }
    },
  },
  mounted() {
    // 페이지가 로드되면 아이템 목록 가져오기
    this.fetchItems();
  },
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
.mt-4 {
  margin-top: 16px;
}
.inventory-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}
.inventory-item {
  text-align: center;
  max-width: 80px;
}
.item-image {
  width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 4px;
  background-color: #fff;
}
.item-name {
  font-size: 12px;
  margin-top: 4px;
  color: #555;
  text-align: center;
}
.simulation-result-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: 2px solid #000;
}
</style>
