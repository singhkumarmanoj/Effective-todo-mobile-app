import { View, Text, StyleSheet } from "react-native";
import { LaptopMinimalCheck,Loader } from "lucide-react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.text}>Hlo</Text>
        <LaptopMinimalCheck size={28} color="blue" style={styles.icon} />
      </View>
<View style={{ justifyContent: "center", alignItems: "center" }}>
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text style={styles.subheading}>Underprocess task</Text>
    <Loader size={18} style={{ marginHorizontal: 6 }} />
    <Text style={styles.subheading}></Text>
  </View>
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,              // fills the screen
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#504545",
  },
  card: {
    padding: 20,
    backgroundColor: "gray",
    borderRadius: 8,
    flexDirection: "row", // places text and icon side by side
    alignItems: "center",
    elevation: 3,         // shadow on Android
  },
  text: {
    fontSize: 18,
    marginRight: 10,
    color: "#333",
  },
  icon: {
    marginLeft: 5,
    // paddingTop:33,
  },
});
