import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, StyleSheet } from 'react-native';

export default function Schedule() {
  const [classes, setClasses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentClass, setCurrentClass] = useState({
    name: '',
    days: [],
    startTime: '',
    endTime: '',
    room: '',
    professor: ''
  });

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const openModal = (index = null) => {
    if (index !== null) {
      setCurrentClass(classes[index]);
      setEditingIndex(index);
    } else {
      setCurrentClass({
        name: '',
        days: [],
        startTime: '',
        endTime: '',
        room: '',
        professor: ''
      });
      setEditingIndex(null);
    }
    setModalVisible(true);
  };

  const toggleDay = (day) => {
    const days = [...currentClass.days];
    const index = days.indexOf(day);
    if (index > -1) {
      days.splice(index, 1);
    } else {
      days.push(day);
    }
    setCurrentClass({...currentClass, days});
  };

  const saveClass = () => {
    if (!currentClass.name || currentClass.days.length === 0 || !currentClass.startTime) {
      alert('Please fill in class name, at least one day, and start time');
      return;
    }

    if (editingIndex !== null) {
      const updated = [...classes];
      updated[editingIndex] = currentClass;
      setClasses(updated);
    } else {
      setClasses([...classes, currentClass]);
    }
    setModalVisible(false);
  };

  const deleteClass = (index) => {
    const updated = classes.filter((_, i) => i !== index);
    setClasses(updated);
  };

  const groupByDay = () => {
    const grouped = {};
    daysOrder.forEach(day => {
      grouped[day] = classes
        .filter(c => c.days.includes(day))
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    return grouped;
  };

  const schedule = groupByDay();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Class Schedule</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Text style={styles.addButtonText}>+ Add Class</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scheduleContainer}>
        {daysOrder.map(day => (
          schedule[day].length > 0 && (
            <View key={day} style={styles.daySection}>
              <Text style={styles.dayHeader}>{day}</Text>
              {schedule[day].map((cls, idx) => {
                const actualIndex = classes.findIndex(c => c === cls);
                return (
                  <View key={idx} style={styles.classCard}>
                    <View style={styles.classInfo}>
                      <Text style={styles.className}>{cls.name}</Text>
                      <Text style={styles.classTime}>
                        {cls.startTime} - {cls.endTime}
                      </Text>
                      <Text style={styles.classDays}>
                        {cls.days.sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b)).join(', ')}
                      </Text>
                      {cls.room && <Text style={styles.classDetail}>Room: {cls.room}</Text>}
                      {cls.professor && <Text style={styles.classDetail}>Prof: {cls.professor}</Text>}
                    </View>
                    <View style={styles.classActions}>
                      <TouchableOpacity onPress={() => openModal(actualIndex)}>
                        <Text style={styles.editText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteClass(actualIndex)}>
                        <Text style={styles.deleteText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )
        ))}
        {classes.length === 0 && (
          <Text style={styles.emptyText}>No classes added yet. Tap "Add Class" to get started!</Text>
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingIndex !== null ? 'Edit Class' : 'Add New Class'}
              </Text>
              
              <TextInput
                style={styles.input}
                placeholder="Class Name *"
                placeholderTextColor="#555"
                value={currentClass.name}
                onChangeText={(text) => setCurrentClass({...currentClass, name: text})}
              />
              
              <Text style={styles.sectionLabel}>Days * (Select one or more)</Text>
              <View style={styles.daysContainer}>
                {daysOrder.map(day => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      currentClass.days.includes(day) && styles.dayButtonSelected
                    ]}
                    onPress={() => toggleDay(day)}
                  >
                    <Text style={[
                      styles.dayButtonText,
                      currentClass.days.includes(day) && styles.dayButtonTextSelected
                    ]}>
                      {day.substring(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TextInput
                style={styles.input}
                placeholder="Start Time (e.g., 9:00 AM) *"
                placeholderTextColor="#555"
                value={currentClass.startTime}
                onChangeText={(text) => setCurrentClass({...currentClass, startTime: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="End Time (e.g., 10:30 AM)"
                placeholderTextColor="#555"
                value={currentClass.endTime}
                onChangeText={(text) => setCurrentClass({...currentClass, endTime: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Room (e.g., Building A 201)"
                placeholderTextColor="#555"
                value={currentClass.room}
                onChangeText={(text) => setCurrentClass({...currentClass, room: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Professor"
                placeholderTextColor="#555"
                value={currentClass.professor}
                onChangeText={(text) => setCurrentClass({...currentClass, professor: text})}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]} 
                  onPress={saveClass}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  scheduleContainer: {
    flex: 1,
    padding: 15,
  },
  daySection: {
    marginBottom: 20,
  },
  dayHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  classTime: {
    fontSize: 16,
    color: '#666',
    marginBottom: 3,
  },
  classDays: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 3,
  },
  classDetail: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  classActions: {
    justifyContent: 'center',
    gap: 10,
  },
  editText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  dayButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  dayButtonTextSelected: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});