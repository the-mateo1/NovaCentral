import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from './FirebaseConfig';

export default function ClassSchedule() {
  const [classes, setClasses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentClass, setCurrentClass] = useState({
    name: '',
    days: [],
    startTime: '',
    endTime: '',
    room: '',
    professor: ''
  });

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const userId = auth.currentUser.uid;
    const classesRef = collection(db, 'classes');
    const q = query(classesRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const loadedClasses = [];
        querySnapshot.forEach((doc) => {
          loadedClasses.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setClasses(loadedClasses);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading classes:', error);
        Alert.alert('Error', 'Failed to load classes');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const openModal = (classItem = null) => {
    if (classItem) {
      setCurrentClass({
        name: classItem.name,
        days: classItem.days,
        startTime: classItem.startTime,
        endTime: classItem.endTime,
        room: classItem.room,
        professor: classItem.professor
      });
      setEditingId(classItem.id);
    } else {
      setCurrentClass({
        name: '',
        days: [],
        startTime: '',
        endTime: '',
        room: '',
        professor: ''
      });
      setEditingId(null);
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

  const saveClass = async () => {
    if (!currentClass.name || currentClass.days.length === 0 || !currentClass.startTime) {
      Alert.alert('Error', 'Please fill in class name, at least one day, and start time');
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const classData = {
        ...currentClass,
        userId,
        updatedAt: new Date().toISOString()
      };

      if (editingId) {
        // Update existing class
        const classRef = doc(db, 'classes', editingId);
        await updateDoc(classRef, classData);
      } else {
        // Add new class
        classData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'classes'), classData);
      }

      setModalVisible(false);
    } catch (error) {
      console.error('Error saving class:', error);
      Alert.alert('Error', 'Failed to save class. Please try again.');
    }
  };

  const deleteClass = async (id) => {
    Alert.alert(
      'Delete Class',
      'Are you sure you want to delete this class?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'classes', id));
            } catch (error) {
              console.error('Error deleting class:', error);
              Alert.alert('Error', 'Failed to delete class. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your schedule...</Text>
      </View>
    );
  }

  const schedule = groupByDay();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Class Schedule</Text>
        <View style={{ flexDirection: 'column', gap: 10 }}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
            <Text style={styles.addButtonText}>+ Add Class</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scheduleContainer}>
        {daysOrder.map(day => (
          schedule[day].length > 0 && (
            <View key={day} style={styles.daySection}>
              <Text style={styles.dayHeader}>{day}</Text>
              {schedule[day].map((cls) => (
                <View key={cls.id} style={styles.classCard}>
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
                    <TouchableOpacity onPress={() => openModal(cls)}>
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteClass(cls.id)}>
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
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
                {editingId ? 'Edit Class' : 'Add New Class'}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
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
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
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
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
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