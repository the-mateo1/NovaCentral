import { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View, Image } from "react-native";

const EventsScreen = () => {
  const [event, setEvent] = useState([]);

  const loadEvents = () => {
    const apiUrl = 
    "https://gist.githubusercontent.com/amiguel4/4c4e39fbecd8a5abc6ae6bf970a6c0d8/raw/c7a8ede953cbf83d3699274a83bd289205792af8/gistfile1.txt"
    
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data)=> {
        const events = data.events.map((evt)=>({
          title: evt.title,
          date: evt.date,
          location: evt.location,
          image: evt.image
        }))
        
        setEvent(events);
      })
    }
    
    useEffect(() => {
      loadEvents();
    }, []);

    return (
      <View style={styles.container}>
        <FlatList
          data={event}
          renderItem={({ item }) => (
            <View style={styles.border}>
              <Image
              source={{ uri: item.image }}
              style={{ width: 40, height: 40, marginRight: 12 }}
              />
              <Text style={styles.item}>{item.title}</Text>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.item}>{item.location}</Text>
            </View>
            )}
          />
        </View>
    );
}

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

export default EventsScreen;