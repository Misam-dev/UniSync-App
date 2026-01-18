import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { studentAPI } from '../services/api';

export default function StudentEvents() {
  const router = useRouter();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setStudentId(user.id);
      }

      const data = await studentAPI.getAllEvents();
      setEvents(data.events || []);
    } catch {
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    if (!studentId) return;

    try {
      await studentAPI.joinEvent(eventId, studentId);
      Alert.alert('Success', 'Joined event successfully');
      loadEvents();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to join event');
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.centered}
      >
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Events</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadEvents();
            }}
            tintColor="#fff"
          />
        }
      >
        {events.length === 0 ? (
          <Text style={styles.emptyText}>No events available</Text>
        ) : (
          events.map((event: any) => (
            <View key={event._id} style={styles.eventCard}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDescription}>{event.description}</Text>
              <Text style={styles.eventInfo}>🏛️ {event.society}</Text>
              <Text style={styles.eventInfo}>
                👥 {event.participants} participants
              </Text>

              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => handleJoinEvent(event._id)}
              >
                <Text style={styles.joinButtonText}>Join Event</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  eventCard: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  eventDescription: {
    fontSize: 14,
    color: '#eee',
    lineHeight: 20,
    marginBottom: 10,
  },
  eventInfo: {
    fontSize: 14,
    color: '#eee',
    marginBottom: 4,
  },
  joinButton: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  joinButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  emptyText: {
    color: '#eee',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
