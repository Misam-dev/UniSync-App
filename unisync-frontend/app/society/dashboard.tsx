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
import { societyAPI, authAPI } from '../services/api';

export default function SocietyDashboard() {
  const router = useRouter();
  const [societyId, setSocietyId] = useState<string | null>(null);
  const [societyName, setSocietyName] = useState('Society');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setSocietyId(user.id);
        setSocietyName(user.name || 'Society');

        const data = await societyAPI.getDashboard(user.id);
        setEvents(data.events || []);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.replace('/');
    } catch {
      await AsyncStorage.clear();
      router.replace('/');
    }
  };

  const handleDeleteEvent = (eventId: string, eventTitle: string) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${eventTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await societyAPI.deleteEvent(eventId);
              Alert.alert('Success', 'Event deleted successfully');
              loadDashboard();
            } catch {
              Alert.alert('Error', 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  const totalParticipants = events.reduce(
    (sum, e) => sum + (e.participants?.length || 0),
    0
  );

  if (loading) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.centered}
      >
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading...</Text>
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
        <View>
          <Text style={styles.greeting}>Society Dashboard</Text>
          <Text style={styles.userName}>{societyName}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{events.length}</Text>
          <Text style={styles.statLabel}>Total Events</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalParticipants}</Text>
          <Text style={styles.statLabel}>Participants</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadDashboard();
            }}
            tintColor="#fff"
          />
        }
      >
        {/* Add Event */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/society/add-event')}
        >
          <Text style={styles.addButtonText}>➕ Create New Event</Text>
        </TouchableOpacity>

        {/* Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Events</Text>

          {events.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyText}>No events yet</Text>
              <Text style={styles.emptySubtext}>
                Create your first event to get started
              </Text>
            </View>
          ) : (
            events.map((event) => (
              <View key={event._id} style={styles.eventCard}>
                <Text style={styles.eventTitle}>{event.title}</Text>

                {/* ✅ FULL DESCRIPTION – NO TRUNCATION */}
                <Text style={styles.eventDescription}>
                  {event.description}
                </Text>

                <Text style={styles.eventParticipants}>
                  👥 {event.participants?.length || 0} participants
                </Text>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      router.push(`/society/participants?id=${event._id}`)
                    }
                  >
                    <Text style={styles.actionText}>View</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      router.push(`/society/edit-event?id=${event._id}`)
                    }
                  >
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() =>
                      handleDeleteEvent(event._id, event.title)
                    }
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
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
  loadingText: {
    color: '#fff',
    marginTop: 12,
  },

  header: {
    padding: 24,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#eee',
    fontSize: 14,
  },
  userName: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
  },

  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#eee',
    marginTop: 4,
    textAlign: 'center',
  },

  addButton: {
    margin: 20,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  addButtonText: {
    fontWeight: '800',
  },

  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
  },

  eventCard: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },

  /* ✅ UPDATED: FULL DESCRIPTION SUPPORT */
  eventDescription: {
    color: '#eee',
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },

  eventParticipants: {
    color: '#eee',
    fontSize: 13,
    marginBottom: 10,
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  deleteText: {
    color: '#fff',
    fontWeight: '700',
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 14,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtext: {
    color: '#eee',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
});
