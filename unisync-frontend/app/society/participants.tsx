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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { societyAPI } from '../services/api';

export default function Participants() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = params.id as string;

  const [eventTitle, setEventTitle] = useState('');
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    try {
      const data = await societyAPI.getParticipants(eventId);
      setEventTitle(data.event.title);
      setParticipants(data.participants || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load participants');
    } finally {
      setLoading(false);
      setRefreshing(false);
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
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Participants</Text>
      </View>

      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{eventTitle}</Text>
        <Text style={styles.participantCount}>
          {participants.length} participant{participants.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadParticipants();
            }}
            tintColor="#fff"
          />
        }
      >
        {participants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>No participants yet</Text>
          </View>
        ) : (
          participants.map((participant: any) => (
            <View key={participant._id} style={styles.participantCard}>
              <Text style={styles.participantName}>{participant.name}</Text>
              <Text style={styles.participantEmail}>{participant.email}</Text>
              {participant.rollno && (
                <Text style={styles.participantDetail}>Roll: {participant.rollno}</Text>
              )}
              {participant.department && (
                <Text style={styles.participantDetail}>Dept: {participant.department}</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

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
    padding: 24,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  eventInfo: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    marginHorizontal: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  participantCount: {
    fontSize: 14,
    color: '#cbd5f5',
      fontWeight: '800',
  },

  participantCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  participantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  participantEmail: {
    fontSize: 16,
    color: '#cbd5f5',
    marginBottom: 2,
  },
  participantDetail: {
    fontSize: 15,
    color: '#cbd5f5',
    marginTop: 2,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#cbd5f5',
  },
});
