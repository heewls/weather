import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "6a1073bc35a741c724908162cd8f8bd6";

const icons = {
    Clouds: "cloudy",
    Clear: "day-sunny",
    Atmosphere: "cloudy-gusts",
    Snow: "snow",
    Rain: "rains",
    Drizzle: "rain",
    Thunderstorm: "lightning",
};

export default function App() {
    const [city, setCity] = useState("Loading...");
    const [ok, setOk] = useState(true);
    const [days, setDays] = useState([]);

    const getWeather = async () => {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) setOk(false);
        const {
            coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({ accuracy: 5 });
        const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
        setCity(location[0].city);
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        const json = await response.json();
        setDays(
            json.list.filter((weather) => {
                if (weather.dt_txt.includes("00:00:00")) {
                    return weather;
                }
            })
        );
    };

    useEffect(() => {
        getWeather();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.city}>
                <Text style={styles.cityName}>{city}</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator="false"
                pagingEnabled
                contentContainerStyle={styles.weather}
            >
                {days.length === 0 ? (
                    <View style={{ ...styles.day, alignItems: "center" }}>
                        <ActivityIndicator color="#FFF7E0" style={{ marginTop: 10 }} size="large" />
                    </View>
                ) : (
                    days.map((d, idx) => (
                        <View key={idx} style={styles.day}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    width: "100%",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text style={styles.temp}>{parseFloat(d.main.temp).toFixed(1)}</Text>
                                <Fontisto name={icons[d.weather[0].main]} size={68} color="#FFF7E0" />
                            </View>
                            <Text style={styles.description}>{d.weather[0].main}</Text>
                            <Text style={styles.tinyText}>{d.weather[0].description}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
            <StatusBar style="light" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F7432",
    },
    city: {
        flex: 1.2,
        justifyContent: "center",
        alignItems: "center",
    },
    cityName: {
        fontSize: 38,
        fontWeight: "500",
        color: "#FFF7E0",
    },
    weather: {},
    day: {
        width: SCREEN_WIDTH,
        alignItems: "flex-start",
        paddingHorizontal: 20,
    },
    temp: {
        fontSize: 100,
        marginTop: 50,
        fontWeight: "600",
        color: "#FFF7E0",
    },
    description: {
        marginTop: -10,
        fontSize: 30,
        color: "#FFF7E0",
        fontWeight: "500",
    },
    tinyText: {
        fontSize: 20,
        color: "#FFF7E0",
    },
});
