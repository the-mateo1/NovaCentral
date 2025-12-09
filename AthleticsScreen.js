import { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View, Image } from "react-native";

const AthleticsScreen = () => {
  const novaLogo = "https://a.espncdn.com/i/teamlogos/ncaa/500/222.png";

  const loadSchedule = () => {
    const apiUrl =
      "http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/222/schedule";
    const today = new Date();

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const game = data.events.map((event) => {
          const competition = event.competitions[0];

          // Use team.id
          const opponent = competition.competitors.find(
            (c) => c.team.id !== "222"
          );

          return {
            id: event.id,
            title: "Men's Basketball vs " + opponent.team.displayName,
            date: event.date,
            logo: opponent.team.logos[0].href,
          };
        });
      // Filter out past games
        const upcoming = game.filter(g => {
          const gameDate = new Date(g.date);
          return gameDate >= today;
        });

        setGames(upcoming);
      });
  };

  

  const [games, setGames] = useState([]);

  useEffect(() => {
    loadSchedule();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        renderItem={({ item }) => (
          <View style={styles.border}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Image
                source={{ uri: novaLogo }}
                style={{ width: 40, height: 40, marginRight: 12 }}
              />
              <Image
                source={{ uri: item.logo }}
                style={{ width: 40, height: 40 }}
              />
            </View>

            <Text style={styles.item}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  item: {
    fontSize: 18,
    marginBottom: 4,
  },
  date: {
    color: "gray",
    marginBottom: 10,
  },
  border: {
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 15,
    padding: 10,
  },
});

export default AthleticsScreen;