<template>
  <v-container class="personal-color-container">
    <!-- 제목 및 설명 -->
    <div class="header-section">
      <h2 class="text-center">{{ colorName }}</h2>
    </div>

    <!-- 색상 팔레트 -->
    <div class="palette-section" v-if="palette.length">
      <h3 class="text-center">🎨 색상 팔레트</h3>
      <div class="palette-grid">
        <div
          v-for="(color, index) in palette"
          :key="index"
          :style="{ backgroundColor: color.hex }"
          class="color-box"
        >{{ color.name }}</div>
      </div>
    </div>

    <!-- 추천 색상 -->
    <div class="recommend-section" v-if="recommendColors.length">
      <h3 class="text-center">🖌️ 어울리는 추천 색상</h3>
      <div class="recommend-grid">
        <div
          v-for="(color, index) in recommendColors"
          :key="index"
          :style="{ backgroundColor: color.hex }"
          class="recommend-box"
        >{{ color.name }}</div>
      </div>
    </div>

    <!-- 스타일 팁 -->
    <div class="style-tips" v-if="styleTips.length">
      <h3 class="text-center">💡 스타일 팁</h3>
      <ul>
        <li v-for="(tip, index) in styleTips" :key="index">{{ tip }}</li>
      </ul>
    </div>

    <!-- 캐릭터 아바타 그리드 -->
    <v-row justify="center" class="avatar-grid">
      <v-col cols="12" class="text-center">
        <h4>🌟 Character Showcase 🌟</h4>
      </v-col>
      <v-col
        v-for="(characterImage, index) in avatars"
        :key="index"
        cols="3"
        class="text-center avatar-container"
        @click="openPopup(index)"
      >
        <!-- 캐릭터 이미지 -->
        <img :src="characterImage" alt="Character Avatar" class="avatar-img" />
        <!-- 하트 버튼 -->
        <div class="vote-container">
          <v-icon
            class="heart-icon"
            :style="{ color: '#FFB6C1' }"
            @click.stop="voteForAvatar(index)"
          >mdi-heart-outline</v-icon>
        </div>
      </v-col>
    </v-row>

    <!-- CharacterInfoPopup 컴포넌트 -->
    <CharacterInfoPopup
      v-if="selectedCharacter"
      :model-value="popupVisible"
      @update:model-value="popupVisible = $event"
      :character="selectedCharacter"
    />
  </v-container>
</template>

<script>
import CharacterInfoPopup from "./CharacterInfoPopup.vue";
import axios from "axios";

export default {
  components: { CharacterInfoPopup },
  props: ["color"],
  data() {
    return {
      avatars: [], //characterImage 데이터를 저장할 배열
      popupVisible: false, // 팝업 표시 상태
      selectedCharacter: null, // 선택된 캐릭터 데이터
      personalColorData: {
        // 🌸 봄 웜톤 (Spring Warm Tone)
        "봄웜 라이트": {
          palette: [
            { name: "라이트 코랄", hex: "#F08080" },
            { name: "라이트 옐로우", hex: "#FFFFE0" },
            { name: "피치 퍼프", hex: "#FFDAB9" }
          ],
          recommendedColors: [
            { name: "코랄 핑크", hex: "#FF6F61" },
            { name: "라이트 옐로우", hex: "#FAFAD2" },
            { name: "살구색", hex: "#FFCBA4" }
          ],
          styleTips: [
            "부드러운 파스텔 계열의 색상을 활용하세요.",
            "골드 액세서리가 따뜻함을 더합니다.",
            "코랄 계열 메이크업으로 생기를 줘보세요."
          ]
        },
        "봄웜 브라이트": {
          palette: [
            { name: "라이트 오렌지", hex: "#FFA07A" },
            { name: "피치 핑크", hex: "#FFD1DC" },
            { name: "라이트 골드", hex: "#F9E79F" }
          ],
          recommendedColors: [
            { name: "크림 베이지", hex: "#F5DEB3" },
            { name: "라이트 오렌지", hex: "#FFA07A" },
            { name: "살구색", hex: "#FFCBA4" }
          ],
          styleTips: [
            "밝고 따뜻한 색상의 의상이 어울립니다.",
            "골드 주얼리를 매치해 따뜻한 느낌을 더하세요.",
            "활기찬 느낌의 메이크업을 추천합니다."
          ]
        },
        "봄웜 트루": {
          palette: [
            { name: "살구", hex: "#FFB07C" },
            { name: "크림 옐로우", hex: "#FFFDD0" },
            { name: "소프트 코랄", hex: "#FF7F50" }
          ],
          recommendedColors: [
            { name: "크림 화이트", hex: "#FFFDD0" },
            { name: "소프트 코랄", hex: "#FF7F50" },
            { name: "라이트 그린", hex: "#98FB98" }
          ],
          styleTips: [
            "밝고 화사한 옷을 선택하세요.",
            "은은한 아이보리와 조화를 이루는 색상이 좋습니다.",
            "따뜻한 느낌의 블러셔를 추천합니다."
          ]
        },

        // ❄️ 여름 쿨톤 (Summer Cool Tone)
        "여름쿨 라이트": {
          palette: [
            { name: "베이비 블루", hex: "#ADD8E6" },
            { name: "라벤더", hex: "#E6E6FA" },
            { name: "소프트 민트", hex: "#B8E2DC" }
          ],
          recommendedColors: [
            { name: "라이트 블루", hex: "#ADD8E6" },
            { name: "라벤더", hex: "#E6E6FA" },
            { name: "민트 그린", hex: "#98FF98" }
          ],
          styleTips: [
            "부드럽고 차분한 색상을 선택하세요.",
            "실버 주얼리가 잘 어울립니다.",
            "자연스러운 립 컬러를 사용해보세요."
          ]
        },
        "여름쿨 브라이트": {
          palette: [
            { name: "아쿠아 블루", hex: "#00FFFF" },
            { name: "핑크 라일락", hex: "#D8BFD8" },
            { name: "라이트 퍼플", hex: "#C8A2C8" }
          ],
          recommendedColors: [
            { name: "푸른 청록색", hex: "#48D1CC" },
            { name: "라일락 핑크", hex: "#D8BFD8" },
            { name: "소프트 블루", hex: "#AFEEEE" }
          ],
          styleTips: [
            "밝고 산뜻한 색조를 활용하세요.",
            "실버 액세서리와 조화로운 룩을 만들어보세요.",
            "푸른빛 아이섀도를 시도해보세요."
          ]
        },
        "여름쿨 뮤트": {
          palette: [
            { name: "더스티 로즈", hex: "#DCAE96" },
            { name: "소프트 블루", hex: "#B0C4DE" },
            { name: "페일 라일락", hex: "#C8A2C8" }
          ],
          recommendedColors: [
            { name: "더스티 핑크", hex: "#DCAE96" },
            { name: "라이트 그레이", hex: "#D3D3D3" },
            { name: "소프트 퍼플", hex: "#B0A2C8" }
          ],
          styleTips: [
            "부드럽고 차분한 느낌의 색조를 사용하세요.",
            "매트한 소재의 옷을 선택하면 좋습니다.",
            "살짝 톤 다운된 립스틱 컬러가 잘 어울립니다."
          ]
        },

        // 🍂 가을 웜톤 (Autumn Warm Tone)
        "가을웜 뮤트": {
          palette: [
            { name: "모카 브라운", hex: "#8B4513" },
            { name: "더스티 옐로우", hex: "#F5DEB3" },
            { name: "올리브 그린", hex: "#808000" }
          ],
          recommendedColors: [
            { name: "모카 브라운", hex: "#8B4513" },
            { name: "소프트 카키", hex: "#BDB76B" },
            { name: "버건디", hex: "#800020" }
          ],
          styleTips: [
            "따뜻한 느낌의 가을 색조를 활용하세요.",
            "코듀로이 소재가 잘 어울립니다.",
            "톤 다운된 메이크업과 매치하세요."
          ]
        },
        // 🍂 가을 웜톤 (Autumn Warm Tone)
        "가을웜 스트롱": {
          palette: [
            { name: "마호가니", hex: "#C04000" },
            { name: "딥 머스타드", hex: "#B8860B" },
            { name: "루비 레드", hex: "#9B111E" }
          ],
          recommendedColors: [
            { name: "다크 브라운", hex: "#654321" },
            { name: "테라코타", hex: "#D3621C" },
            { name: "딥 오렌지", hex: "#FF4500" }
          ],
          styleTips: [
            "무게감 있는 깊은 색조의 의상을 추천합니다.",
            "가죽 소재 액세서리를 활용하면 더욱 스타일리시합니다.",
            "따뜻한 계열의 립스틱과 잘 어울립니다."
          ]
        },
        "가을웜 딥": {
          palette: [
            { name: "초콜릿 브라운", hex: "#3F1E12" },
            { name: "버건디", hex: "#800020" },
            { name: "다크 오렌지", hex: "#FF8C00" }
          ],
          recommendedColors: [
            { name: "다크 카키", hex: "#4B5320" },
            { name: "레드 브라운", hex: "#A52A2A" },
            { name: "딥 옐로우", hex: "#F4A460" }
          ],
          styleTips: [
            "짙고 어두운 색조의 패션 아이템을 활용하세요.",
            "니트와 울 소재의 옷이 어울립니다.",
            "매트한 브라운 계열의 메이크업을 추천합니다."
          ]
        },

        // 🌌 겨울 쿨톤 (Winter Cool Tone)
        "겨울쿨 브라이트": {
          palette: [
            { name: "브릴리언트 블루", hex: "#007FFF" },
            { name: "아이시 핑크", hex: "#FFD1DC" },
            { name: "라임 그린", hex: "#32CD32" }
          ],
          recommendedColors: [
            { name: "네온 블루", hex: "#1E90FF" },
            { name: "화이트", hex: "#FFFFFF" },
            { name: "스칼렛 레드", hex: "#FF2400" }
          ],
          styleTips: [
            "밝고 대조적인 색조를 선택하세요.",
            "실버 액세서리와 함께 모던한 느낌을 더하세요.",
            "시원한 느낌의 립스틱 컬러가 잘 어울립니다."
          ]
        },
        "겨울쿨 스트롱": {
          palette: [
            { name: "딥 네이비", hex: "#001F54" },
            { name: "다크 퍼플", hex: "#4B0082" },
            { name: "체리 레드", hex: "#DE3163" }
          ],
          recommendedColors: [
            { name: "차콜 그레이", hex: "#36454F" },
            { name: "포레스트 그린", hex: "#228B22" },
            { name: "클래식 레드", hex: "#B22222" }
          ],
          styleTips: [
            "짙은 색조의 대조를 활용하세요.",
            "시크한 블랙과 어울리는 스타일링을 추천합니다.",
            "강렬한 컬러 포인트로 생동감을 더하세요."
          ]
        },
        "겨울쿨 다크": {
          palette: [
            { name: "다크 블루", hex: "#00008B" },
            { name: "플럼 퍼플", hex: "#673147" },
            { name: "와인 레드", hex: "#722F37" }
          ],
          recommendedColors: [
            { name: "다크 그레이", hex: "#2F4F4F" },
            { name: "미드나잇 블루", hex: "#191970" },
            { name: "딥 퍼플", hex: "#4B0082" }
          ],
          styleTips: [
            "깊고 어두운 색상의 패션 아이템을 추천합니다.",
            "트위드나 벨벳 소재로 고급스러운 느낌을 더하세요.",
            "강렬한 다크 레드 립스틱과 매치하세요."
          ]
        }
      }
    };
  },
  computed: {
    colorName() {
      return decodeURIComponent(this.color); // URL에서 인코딩된 값을 디코딩
    },
    palette() {
      return this.personalColorData[this.colorName]?.palette || [];
    },
    recommendColors() {
      return this.personalColorData[this.colorName]?.recommendedColors || [];
    },
    styleTips() {
      return this.personalColorData[this.colorName]?.styleTips || [];
    }
  },
  methods: {
    async fetchToneData() {
      try {
        // 1. API 호출 전 로그 추가로 데이터 확인 (문제 파악)
        console.log("Fetching tone data for:", this.color);

        // 백엔드 API 호출하여 characterImage 데이터 가져오기
        const response = await axios.get(
          `http://localhost:8081/api/personal/tone`,
          {
            params: { tone: this.color }
          }
        );

        // 2. API 응답 데이터 확인 (문제가 응답 데이터일 가능성 고려)
        console.log("API Response Data:", response.data);

        // 3. 응답 데이터를 avatars에 매핑
        this.avatars = response.data; // characterImage 데이터 저장
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
      }
    },
    voteForAvatar(index) {
      this.$set(this.avatars, index, {
        ...this.avatars[index],
        votes: (this.avatars[index].votes || 0) + 1
      });
    },
    openPopup(index) {
      this.selectedCharacter = this.avatars[index];
      this.popupVisible = true;
    }
  },
    mounted() {
    // 5. 컴포넌트 로드 시 데이터 가져오기
    console.log("Component Mounted: Fetching tone data...");
    this.fetchToneData();
  }
};
</script>

<style scoped>
.personal-color-container {
  padding: 20px;
}

.header-section h2 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.palette-section,
.recommend-section,
.style-tips {
  margin-top: 40px;
}

.palette-grid,
.recommend-grid {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.color-box,
.recommend-box {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 0.9rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.style-tips ul {
  list-style-type: disc;
  padding-left: 20px;
  color: #555;
}

.style-tips ul li {
  margin-bottom: 10px;
}
.avatar-grid {
  margin-top: 40px;
}
.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.vote-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.heart-icon {
  cursor: pointer;
  font-size: 24px;
  transition: transform 0.2s ease;
}
.heart-icon:hover {
  transform: scale(1.2);
}
</style>
