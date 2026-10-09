import { Caveat_700Bold, useFonts } from "@expo-google-fonts/caveat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({ Caveat_700Bold });
  const [birthDate, setBirthDate] = useState("");
  const [message, setMessage] = useState("생년월일을 입력");
  const [recommendMessage, SetRecommendMessage] = useState("");

  useEffect(() => {
    const loadBirthDate = async () => {
      const saveBirthDate = await AsyncStorage.getItem("birthDate");
      if (saveBirthDate !== null) {
        setBirthDate(saveBirthDate);
      }
    };
    loadBirthDate();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const recommend = async () => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (birthDate.trim() === "" || !datePattern.test(birthDate)) {
      alert("YYYY-MM-DD 형식으로 입력해주세요");
      return;
    }

    await AsyncStorage.setItem("birthDate", birthDate);

    const birth = new Date(birthDate);
    const today = new Date();

    const diffTime = today.getTime() - birth.getTime();

    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const physical = calculateCycle(days, 23);
    const emotional = calculateCycle(days, 28);
    const intellectual = calculateCycle(days, 33);

    const food = recommendFood(physical);

    setMessage(
      `💪신체: ${physical.toFixed(0)}%\n` +
        `❤️감성: ${emotional.toFixed(0)}%\n` +
        `🧠지성: ${intellectual.toFixed(0)}%\n`,
    );
    SetRecommendMessage(`오늘 점심은 ${food}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biorhythm Lunch V0.1</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={birthDate}
        onChangeText={setBirthDate}
        keyboardType="number-pad"
      />
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.recomment}>{recommendMessage}</Text>
      <Button title="음식추천받기" onPress={recommend} />
    </View>
  );
}

function calculateCycle(days: number, cycle: number): number {
  return Math.sin((2 * Math.PI * days) / cycle) * 100;
}

function recommendFood(physical: number): string {
  let foods: string[];

  if (physical >= 70) {
    // 컨디션 매우 좋음 → 든든하고 푸짐한 메뉴
    foods = [
      "삼겹살",
      "돼지갈비",
      "소갈비",
      "불고기",
      "제육볶음",
      "닭갈비",
      "찜닭",
      "보쌈",
      "족발",
      "감자탕",
      "부대찌개",
      "김치찌개",
      "순대국",
      "돼지국밥",
      "설렁탕",
      "갈비탕",
      "육개장",
      "뼈해장국",
      "돈까스",
      "치킨",
      "햄버거",
      "피자",
      "스테이크",
      "짜장면",
      "짬뽕",
      "볶음밥",
      "마라탕",
      "카레",
      "비빔밥",
      "낙지볶음",
    ];
  } else if (physical >= 30) {
    // 컨디션 좋음 → 평범하게 든든한 점심
    foods = [
      "김치찌개",
      "된장찌개",
      "순두부찌개",
      "부대찌개",
      "제육볶음",
      "불고기",
      "비빔밥",
      "돌솥비빔밥",
      "오징어볶음",
      "닭갈비",
      "김치볶음밥",
      "볶음밥",
      "짜장면",
      "짬뽕",
      "돈까스",
      "카레",
      "오므라이스",
      "파스타",
      "햄버거",
      "칼국수",
      "수제비",
      "떡볶이",
      "김밥",
      "쫄면",
      "국밥",
      "설렁탕",
      "갈비탕",
      "육개장",
      "초밥",
      "쌀국수",
    ];
  } else if (physical >= 0) {
    // 보통 → 적당히 든든하면서 부담 없는 메뉴
    foods = [
      "된장찌개",
      "순두부찌개",
      "청국장",
      "비빔밥",
      "콩나물국밥",
      "김밥",
      "칼국수",
      "수제비",
      "잔치국수",
      "비빔국수",
      "냉면",
      "막국수",
      "메밀국수",
      "떡국",
      "만둣국",
      "김치볶음밥",
      "계란볶음밥",
      "생선구이",
      "고등어구이",
      "두부조림",
      "닭곰탕",
      "곰탕",
      "쌀국수",
      "샌드위치",
      "샐러드",
      "포케",
      "파스타",
      "초밥",
      "회덮밥",
      "김치말이국수",
    ];
  } else if (physical >= -50) {
    // 컨디션 낮음 → 따뜻하고 비교적 부담 없는 메뉴
    foods = [
      "죽",
      "전복죽",
      "닭죽",
      "야채죽",
      "순두부찌개",
      "콩나물국밥",
      "북엇국",
      "미역국",
      "소고기무국",
      "닭곰탕",
      "곰탕",
      "설렁탕",
      "떡국",
      "만둣국",
      "칼국수",
      "수제비",
      "잔치국수",
      "메밀국수",
      "생선구이",
      "두부조림",
      "계란찜",
      "두부전골",
      "샐러드",
      "샌드위치",
      "쌀국수",
      "월남쌈",
      "포케",
      "연어덮밥",
      "닭가슴살 샐러드",
      "야채수프",
    ];
  } else {
    // 컨디션 매우 낮음 → 부드럽고 가벼운 메뉴
    foods = [
      "전복죽",
      "닭죽",
      "야채죽",
      "소고기죽",
      "호박죽",
      "흰죽",
      "미역국",
      "북엇국",
      "콩나물국",
      "소고기무국",
      "닭곰탕",
      "곰탕",
      "순두부",
      "순두부찌개",
      "계란찜",
      "두부조림",
      "두부전골",
      "생선구이",
      "고등어구이",
      "연어구이",
      "떡국",
      "만둣국",
      "잔치국수",
      "칼국수",
      "메밀국수",
      "쌀국수",
      "샐러드",
      "닭가슴살 샐러드",
      "야채수프",
      "샌드위치",
    ];
  }
  const radomIndex = Math.floor(Math.random() * foods.length);
  return foods[radomIndex];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
  },

  title: {
    fontSize: 36,
    fontFamily: "Caveat_700Bold",
  },

  message: {
    fontSize: 23,
  },

  recomment: {
    fontSize: 27,
    fontWeight: "bold",
    color: "blue",
  },

  input: {
    width: 200,
    borderWidth: 1,
    padding: 10,
  },
});
