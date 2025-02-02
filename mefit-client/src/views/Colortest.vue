<template>
    <v-container class="py-10 powder-room-container">
      <!-- 헤더 -->
      <v-row justify="center" class="mb-10">
        <h2 class="header-text">🌸 나만의 색상 컬렉션 🌸</h2>
      </v-row>
  
      <!-- 색상 피커 및 버튼 -->
      <v-row justify="center" align="center" class="mb-8">
        <v-col cols="12" md="6">
          <v-card class="picker-card powder-box" elevation="12">
            <v-color-picker v-model="selectedColor" flat hide-canvas></v-color-picker>
            <v-btn
              block
              color="pink lighten-2"
              class="mt-5 add-color-btn"
              @click="addColor"
              :disabled="!selectedColor"
            >
              💖 색상 추가 💖
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- 저장된 색상 박스 -->
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card class="saved-colors-box powder-box" elevation="6">
            <v-row dense justify="center">
              <v-col
                v-for="(color, index) in savedColors"
                :key="index"
                cols="6"
                md="3"
                class="pa-2"
              >
                <v-card :style="{ backgroundColor: color }" class="color-box powder-box" outlined>
                  <div class="color-info">{{ color }}</div>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedColor: '#ffffff', // 초기 색상
        savedColors: []           // 저장된 색상 배열
      };
    },
    methods: {
      addColor() {
        if (this.selectedColor && !this.savedColors.includes(this.selectedColor)) {
          this.savedColors.push(this.selectedColor); // 선택한 색상 추가
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* 컬러풀하고 발랄한 스타일 */
  .powder-room-container {
    background: linear-gradient(to bottom, #fff4f8, #ffe0ec);
    border-radius: 16px;
    padding: 40px;
    animation: fadeIn 0.8s ease;
  }
  
  .header-text {
    font-size: 2.5rem;
    font-weight: 700;
    color: #d81b60;
    text-align: center;
    font-family: 'Cursive', 'Nunito', sans-serif;
    text-shadow: 0px 3px 5px rgba(255, 182, 193, 0.7);
  }
  
  .picker-card {
    padding: 24px;
    border-radius: 30px;
    background: #fff7fa;
    border: 2px dashed #f48fb1;
    box-shadow: 0 4px 8px rgba(240, 98, 146, 0.4);
  }
  
  .add-color-btn {
    font-weight: bold;
    font-size: 1.2rem;
    border-radius: 30px;
    text-transform: none;
    transition: background 0.3s;
  }
  
  .add-color-btn:hover {
    background: #f06292 !important;
    color: white;
  }
  
  .saved-colors-box {
    border-radius: 30px;
    padding: 24px;
    background: #ffe0ec;
    animation: popIn 0.6s ease;
  }
  
  .color-box {
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
    border-radius: 20px;
    border: 2px solid white;
    transition: transform 0.4s ease, box-shadow 0.4s ease;
    box-shadow: 0 4px 10px rgba(255, 182, 193, 0.5);
  }
  
  .color-box:hover {
    transform: scale(1.1) rotate(-2deg);
    box-shadow: 0 6px 15px rgba(255, 105, 180, 0.8);
  }
  
  .color-info {
    text-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);
    font-family: 'Cursive', sans-serif;
  }
  
  .powder-box {
    border-radius: 30px;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes popIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  </style>
  