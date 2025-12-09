import { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View, Image } from "react-native";

// Convert from Zulu time to Eastern Time
const formatDateToET = (isoString) => {
  try {
    const dateUTC = new Date(isoString);

    const formatter = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "America/New_York",
      hour12: true,
    });

    return formatter.format(dateUTC) + " ET";
  } catch (err) {
    return isoString; // fallback
  }
};

const AthleticsScreen = () => {
  const novaLogo = "https://a.espncdn.com/i/teamlogos/ncaa/500/222.png";
  const [games, setGames] = useState([]);

  const loadSchedule = () => {
    const apiUrl =
      "http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/222/schedule";

    const today = new Date();

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const mapped = data.events.map((event) => {
          const comp = event.competitions[0];

          const opponent = comp.competitors.find(
            (c) => c.team.id !== "222"
          );

          return {
            id: event.id,
            title: "Men's Basketball vs " + opponent.team.displayName,
            dateRaw: event.date,
            dateFormatted: formatDateToET(event.date),
            logo: opponent.team.logos[0].href,
          };
        });

        // keep only upcoming games
        const upcoming = mapped.filter((g) => new Date(g.dateRaw) >= today);

        setGames(upcoming);
      })
      .catch((error) => console.error("Error loading schedule:", error));
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Logo Row */}
            <View style={styles.logoRow}>
              <Image source={{ uri: novaLogo }} style={styles.logoLarge} />
              <Image source={{ uri: item.logo }} style={styles.logoLarge} />
            </View>

            {/* Title */}
            <Text style={styles.title}>{item.title}</Text>

            {/* Date */}
            <Text style={styles.date}>{item.dateFormatted}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 14,
    backgroundColor: "#f8f8f8",
    flex: 1,
  },

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  logoLarge: {
    width: 70,
    height: 70,
    marginHorizontal: 12,
    borderRadius: 0,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 6,
  },

  date: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default AthleticsScreen;
