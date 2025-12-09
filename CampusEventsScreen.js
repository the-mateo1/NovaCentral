import { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View, Image } from "react-native";

const CampusEventsScreen = () => {
  const [events, setEvents] = useState([]);

  const loadEvents = () => {
    const apiUrl =
      "https://gist.githubusercontent.com/amiguel4/4c4e39fbecd8a5abc6ae6bf970a6c0d8/raw/c7a8ede953cbf83d3699274a83bd289205792af8/gistfile1.txt";

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const mapped = data.events.map((evt) => ({
          title: evt.title,
          date: evt.date,
          location: evt.location,
          image: evt.image,
        }));

        setEvents(mapped);
      });
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Event Image */}
            <Image source={{ uri: item.image }} style={styles.eventImage} />

            {/* Text Section */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.location}>{item.location}</Text>
            </View>
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
    borderRadius: 14,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  eventImage: {
    width: "100%",
    height: 160,
  },

  textContainer: {
    padding: 14,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
  },

  date: {
    fontSize: 16,
    color: "#666",
    marginBottom: 6,
  },

  location: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});

export default CampusEventsScreen;
