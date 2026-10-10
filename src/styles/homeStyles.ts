import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
  },

  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },

  title: {
    fontSize: 37,
    fontFamily: "Caveat_700Bold",
  },

  message: {
    fontSize: 23,
    padding: -3,
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
