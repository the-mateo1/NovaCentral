import { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AthleticsScreen from "./AthleticsScreen";
import CampusEventsScreen from "./CampusEventsScreen";

export default function CombinedEventsScreen() {
  const [selected, setSelected] = useState("athletics");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const choose = (type) => {
    setSelected(type);
    setDropdownOpen(false);
  };

  return (
    <View style={{ flex: 1 }}>

      {/* Centered Header Dropdown */}
      <View style={styles.dropdownHeader}>
        <View style={styles.centerWrapper}>
          <TouchableOpacity
            onPress={toggleDropdown}
            style={styles.dropdownButton}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownText}>
              {selected === "athletics" ? "Athletics" : "On-Campus"}
            </Text>
            <Ionicons
              name={dropdownOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color="#333"
            />
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity
                onPress={() => choose("athletics")}
                style={styles.menuItem}
              >
                <Text style={styles.menuText}>Athletics Events</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => choose("campus")}
                style={styles.menuItem}
              >
                <Text style={styles.menuText}>On-Campus Events</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* CONTENT SWITCHER */}
      {selected === "athletics" ? (
        <AthleticsScreen />
      ) : (
        <CampusEventsScreen />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownHeader: {
    backgroundColor: "white",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  centerWrapper: {
    alignItems: "center",
  },

  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",  
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    width: 260,            
  },

  dropdownText: {
    fontSize: 20,
    fontWeight: "600",
    marginRight: 6,
  },

  dropdownMenu: {
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    width: 260,              
  },

  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  menuText: {
    fontSize: 18,
  },
});