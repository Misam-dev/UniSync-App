import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { authAPI } from './services/api';

export default function LoginScreen() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<'student' | 'society' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  /* ================= LOGIN HANDLER ================= */

  const handleLogin = async () => {
    if (!selectedRole) {
      Alert.alert('Error', 'Please select a role');
      return;
    }

    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login(email.trim(), password.trim());

      if (!response?.success || !response?.user) {
        Alert.alert('Login Failed', 'Invalid credentials');
        return;
      }

      // 🚫 BLOCK ROLE MISMATCH
      if (response.user.role !== selectedRole) {
        Alert.alert(
          'Access Denied',
          `You selected ${selectedRole.toUpperCase()} login, but this account belongs to a ${response.user.role.toUpperCase()}.`
        );
        return;
      }

      // ✅ ROLE VERIFIED → NAVIGATE
      if (response.user.role === 'student') {
        router.replace('/student/dashboard');
      } else if (response.user.role === 'society') {
        router.replace('/society/dashboard');
      } else {
        Alert.alert('Error', 'Unknown user role');
      }

    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Unable to connect to server'
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGIN FORM ================= */

  const renderLoginForm = () => (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.content}>

            <Pressable
              style={styles.backButton}
              disabled={loading}
              onPress={() => {
                setSelectedRole(null);
                setEmail('');
                setPassword('');
              }}
            >
              <Text style={styles.backIcon}>←</Text>
            </Pressable>

            <Text style={styles.title}>
              {selectedRole === 'student' ? 'Student Login' : 'Society Login'}
            </Text>

            <Text style={styles.roleIndicator}>
Logging in as {selectedRole?.toUpperCase()}

            </Text>

            <View style={styles.form}>
              <TextInput
                placeholder="Email"
                placeholderTextColor="#eee"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />

              <TextInput
                placeholder="Password"
                placeholderTextColor="#eee"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />

              <Pressable
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.loginText}>Login</Text>
                )}
              </Pressable>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );

  /* ================= ROLE SELECTION ================= */

  if (selectedRole) {
    return renderLoginForm();
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>UniSync</Text>
        <Text style={styles.subtitle}>Choose your role</Text>

        <Pressable
          style={styles.roleButton}
          onPress={() => setSelectedRole('student')}
        >
          <Text style={styles.roleText}>🎓 Student</Text>
        </Pressable>

        <Pressable
          style={styles.roleButton}
          onPress={() => setSelectedRole('society')}
        >
          <Text style={styles.roleText}>🏛️ Society</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    color: '#eee',
    marginBottom: 30,
  },
  roleIndicator: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    marginBottom: 20,
  },
  roleButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
  },
  roleText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  backIcon: {
    fontSize: 22,
    color: '#fff',
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    padding: 16,
    borderRadius: 12,
    color: '#fff',
  },
  loginButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    fontWeight: '700',
    fontSize: 16,
  },
});
