import { Caveat_700Bold, useFonts } from "@expo-google-fonts/caveat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Button, Card, Text, TextInput } from "react-native-paper";

import { styles } from "@/styles/homeStyles";
import { recommendFood } from "@/utils/recommendFood";

function calculateCycle(days: number, cycle: number): number {
  return Math.sin((2 * Math.PI * days) / cycle) * 100;
}

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({ Caveat_700Bold });
  const [birthDate, setBirthDate] = useState("");
  const [recommendMessage, SetRecommendMessage] = useState("");

  const [physical, setPhysical] = useState(0);
  const [emotional, setEmotional] = useState(0);
  const [intellectual, setIntellectual] = useState(0);

  const [physicalData, setPhysicalData] = useState<{ value: number }[]>([]);
  const [emotionalData, setEmotionalData] = useState<{ value: number }[]>([]);
  const [intellectualData, setIntellectualData] = useState<{ value: number }[]>(
    [],
  );

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
    const datePattern = /^\d{8}$/;

    if (birthDate.trim() === "" || !datePattern.test(birthDate)) {
      alert("YYYYMMDD 형식으로 입력해주세요");
      return;
    }

    const year = birthDate.slice(0, 4);
    const month = birthDate.slice(4, 6);
    const day = birthDate.slice(6, 8);

    await AsyncStorage.setItem("birthDate", birthDate);

    const birth = new Date(Number(year), Number(month) - 1, Number(day));
    const today = new Date();

    const diffTime = today.getTime() - birth.getTime();

    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const physicalValue = calculateCycle(days, 23);
    const emotionalValue = calculateCycle(days, 28);
    const intellectualValue = calculateCycle(days, 33);

    const physicalGraphData = [];
    const emotionalGraphData = [];
    const intellectualGraphData = [];

    for (let i = -7; i <= 7; i++) {
      const physicalValue = calculateCycle(days + i, 23);
      const emotionalValue = calculateCycle(days + i, 28);
      const intellectualValue = calculateCycle(days + i, 33);

      physicalGraphData.push({
        value: physicalValue,
        dataPointColor: i === 0 ? "gray" : "black",
        dataPointRadius: i === 0 ? 5 : 0,
      });

      emotionalGraphData.push({
        value: emotionalValue,
        dataPointColor: i === 0 ? "gray" : "black",
        dataPointRadius: i === 0 ? 5 : 0,
      });

      intellectualGraphData.push({
        value: intellectualValue,
        dataPointColor: i === 0 ? "gray" : "black",
        dataPointRadius: i === 0 ? 5 : 0,
      });
    }

    setPhysicalData(physicalGraphData);
    setEmotionalData(emotionalGraphData);
    setIntellectualData(intellectualGraphData);

    setPhysical(physicalValue);
    setEmotional(emotionalValue);
    setIntellectual(intellectualValue);

    const food = recommendFood(physicalValue);
    SetRecommendMessage(`오늘 점심은 ${food}`);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Biorhythm Lunch v0.7</Text>
      <View style={styles.legend}>
        <Text style={{ color: "red" }}>● 신체</Text>
        <Text style={{ color: "green" }}>● 감성</Text>
        <Text style={{ color: "blue" }}>● 지성</Text>
      </View>
      <Card mode="outlined" style={styles.chartCard}>
        <Card.Content>
          <LineChart
            data={physicalData}
            data2={emotionalData}
            data3={intellectualData}
            color1="red"
            color2="green"
            color3="blue"
            spacing={23}
            maxValue={100}
            mostNegativeValue={-100}
            noOfSections={5}
            noOfSectionsBelowXAxis={5}
            stepValue={20}
            negativeStepValue={20}
            height={90}
            xAxisLength={300}
            hideRules
          />
        </Card.Content>
      </Card>
      <TextInput
        style={styles.input}
        label="생년월일입력 YYYYMMDD"
        value={birthDate}
        onChangeText={setBirthDate}
        keyboardType="numeric"
        maxLength={8}
        mode="outlined"
      />
      <View style={styles.statusRow}>
        <Card style={styles.statusCard} mode="outlined">
          <Card.Content>
            <Text>신체</Text>
            <Text style={styles.message}>{physical.toFixed(0)}%</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statusCard} mode="outlined">
          <Card.Content>
            <Text>감성</Text>
            <Text style={styles.message}>{emotional.toFixed(0)}%</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statusCard} mode="outlined">
          <Card.Content>
            <Text>지성</Text>
            <Text style={styles.message}>{intellectual.toFixed(0)}%</Text>
          </Card.Content>
        </Card>
      </View>

      <Card mode="outlined" style={styles.chartCard}>
        <Card.Content>
          {/* <Text variant="labelMedium">오늘의 점심은</Text> */}
          <Text variant="headlineSmall" style={{ color: "blue" }}>
            {recommendMessage}
          </Text>
        </Card.Content>
      </Card>

      {recommendMessage ? (
        <Button
          mode="contained"
          onPress={recommend}
          style={styles.recommendButton}
        >
          다시추천받기
        </Button>
      ) : (
        <Button
          mode="contained"
          onPress={recommend}
          style={styles.recommendButton}
        >
          음식추천받기
        </Button>
      )}
    </View>
  );
}
