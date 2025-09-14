import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Thermometer, Droplets, Gauge, Battery, Power, Wifi, TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface SensorData {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  waterLevel: number;
  recycledWaterLevel: number;
  pumpStatus: boolean;
  connectionStatus: 'connected' | 'disconnected';
}

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData>({
    soilMoisture: 65,
    temperature: 24.5,
    humidity: 78,
    waterLevel: 85,
    recycledWaterLevel: 45,
    pumpStatus: false,
    connectionStatus: 'connected',
  });

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Soil moisture optimal in Zone A', type: 'success' },
    { id: 2, message: 'Water tank level low - refill recommended', type: 'warning' },
  ]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setSensorData(prev => ({
        ...prev,
        soilMoisture: Math.max(0, Math.min(100, prev.soilMoisture + (Math.random() - 0.5) * 3)),
        temperature: Math.max(15, Math.min(35, prev.temperature + (Math.random() - 0.5) * 0.5)),
        humidity: Math.max(30, Math.min(95, prev.humidity + (Math.random() - 0.5) * 2)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const togglePump = () => {
    if (sensorData.connectionStatus === 'disconnected') {
      Alert.alert('Connection Error', 'Unable to connect to ESP32 device');
      return;
    }

    setSensorData(prev => ({
      ...prev,
      pumpStatus: !prev.pumpStatus,
    }));

    Alert.alert(
      'Pump Control',
      `Irrigation pump has been turned ${sensorData.pumpStatus ? 'OFF' : 'ON'}`,
    );
  };

  const getSensorColor = (value: number, type: 'moisture' | 'temperature' | 'level') => {
    if (type === 'moisture') {
      if (value > 70) return '#22C55E'; // Green - Good
      if (value > 40) return '#F59E0B'; // Yellow - Moderate  
      return '#EF4444'; // Red - Low
    }
    if (type === 'temperature') {
      if (value >= 20 && value <= 28) return '#22C55E';
      if (value >= 15 && value <= 35) return '#F59E0B';
      return '#EF4444';
    }
    if (type === 'level') {
      if (value > 60) return '#22C55E';
      if (value > 20) return '#F59E0B';
      return '#EF4444';
    }
    return '#6B7280';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Farm Dashboard</Text>
        <View style={styles.connectionStatus}>
          <Wifi 
            size={16} 
            color={sensorData.connectionStatus === 'connected' ? '#22C55E' : '#EF4444'} 
          />
          <Text style={[
            styles.connectionText, 
            { color: sensorData.connectionStatus === 'connected' ? '#22C55E' : '#EF4444' }
          ]}>
            {sensorData.connectionStatus === 'connected' ? 'Connected' : 'Offline'}
          </Text>
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.notificationContainer}>
        {notifications.map(notification => (
          <View 
            key={notification.id} 
            style={[
              styles.notification,
              { borderLeftColor: notification.type === 'success' ? '#22C55E' : '#F59E0B' }
            ]}
          >
            <AlertTriangle 
              size={16} 
              color={notification.type === 'success' ? '#22C55E' : '#F59E0B'} 
            />
            <Text style={styles.notificationText}>{notification.message}</Text>
          </View>
        ))}
      </View>

      {/* Sensor Data Cards */}
      <View style={styles.sensorGrid}>
        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <Droplets size={24} color={getSensorColor(sensorData.soilMoisture, 'moisture')} />
            <Text style={styles.sensorLabel}>Soil Moisture</Text>
          </View>
          <Text style={[styles.sensorValue, { color: getSensorColor(sensorData.soilMoisture, 'moisture') }]}>
            {sensorData.soilMoisture.toFixed(0)}%
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${sensorData.soilMoisture}%`,
                  backgroundColor: getSensorColor(sensorData.soilMoisture, 'moisture')
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <Thermometer size={24} color={getSensorColor(sensorData.temperature, 'temperature')} />
            <Text style={styles.sensorLabel}>Temperature</Text>
          </View>
          <Text style={[styles.sensorValue, { color: getSensorColor(sensorData.temperature, 'temperature') }]}>
            {sensorData.temperature.toFixed(1)}°C
          </Text>
        </View>

        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <Gauge size={24} color={getSensorColor(sensorData.humidity, 'level')} />
            <Text style={styles.sensorLabel}>Humidity</Text>
          </View>
          <Text style={[styles.sensorValue, { color: getSensorColor(sensorData.humidity, 'level') }]}>
            {sensorData.humidity.toFixed(0)}%
          </Text>
        </View>

        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <Battery size={24} color={getSensorColor(sensorData.waterLevel, 'level')} />
            <Text style={styles.sensorLabel}>Water Tank</Text>
          </View>
          <Text style={[styles.sensorValue, { color: getSensorColor(sensorData.waterLevel, 'level') }]}>
            {sensorData.waterLevel.toFixed(0)}%
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${sensorData.waterLevel}%`,
                  backgroundColor: getSensorColor(sensorData.waterLevel, 'level')
                }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Control Panel */}
      <View style={styles.controlPanel}>
        <Text style={styles.sectionTitle}>Irrigation Control</Text>
        
        <TouchableOpacity
          style={[
            styles.controlButton,
            { backgroundColor: sensorData.pumpStatus ? '#EF4444' : '#22C55E' }
          ]}
          onPress={togglePump}
        >
          <Power size={24} color="#FFFFFF" />
          <Text style={styles.controlButtonText}>
            {sensorData.pumpStatus ? 'Turn OFF Pump' : 'Turn ON Pump'}
          </Text>
        </TouchableOpacity>

        <View style={styles.statusIndicator}>
          <Text style={styles.statusLabel}>Pump Status:</Text>
          <View style={[
            styles.statusDot,
            { backgroundColor: sensorData.pumpStatus ? '#22C55E' : '#6B7280' }
          ]} />
          <Text style={styles.statusText}>
            {sensorData.pumpStatus ? 'Running' : 'Stopped'}
          </Text>
        </View>
      </View>

      {/* Water Usage Stats */}
      <View style={styles.statsPanel}>
        <Text style={styles.sectionTitle}>Water Usage Today</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Fresh Water Used:</Text>
          <Text style={styles.statValue}>245L</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Recycled Water Used:</Text>
          <Text style={styles.statValue}>156L</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Recycling Efficiency:</Text>
          <Text style={[styles.statValue, { color: '#22C55E' }]}>39%</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  connectionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notificationContainer: {
    marginBottom: 20,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  sensorCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sensorLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  sensorValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  controlPanel: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  statsPanel: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});