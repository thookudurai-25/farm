import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {
  Droplets,
  Sprout,
  Timer,
  Settings,
  Power,
  Gauge,
  Battery,
  Zap,
} from 'lucide-react-native';

interface IrrigationSystem {
  id: string;
  name: string;
  type: 'drip' | 'sprinkler';
  status: 'running' | 'stopped' | 'scheduled';
  waterFlow: number; // L/min
  duration: number; // minutes
  tankLevel: number; // percentage
  pressure: number; // PSI
}

interface Schedule {
  id: string;
  time: string;
  duration: number;
  systemId: string;
  enabled: boolean;
  days: string[];
}

export default function Irrigation() {
  const [systems, setSystems] = useState<IrrigationSystem[]>([
    {
      id: 'drip-1',
      name: 'Vegetable Drip Zone A',
      type: 'drip',
      status: 'stopped',
      waterFlow: 8.5,
      duration: 0,
      tankLevel: 78,
      pressure: 15,
    },
    {
      id: 'sprinkler-1',
      name: 'Main Field Sprinkler',
      type: 'sprinkler',
      status: 'running',
      waterFlow: 25.2,
      duration: 15,
      tankLevel: 45,
      pressure: 22,
    },
    {
      id: 'drip-2',
      name: 'Greenhouse Drip System',
      type: 'drip',
      status: 'scheduled',
      waterFlow: 6.8,
      duration: 0,
      tankLevel: 89,
      pressure: 18,
    },
  ]);

  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: 'sch-1',
      time: '06:00',
      duration: 30,
      systemId: 'drip-1',
      enabled: true,
      days: ['Mon', 'Wed', 'Fri'],
    },
    {
      id: 'sch-2',
      time: '18:00',
      duration: 20,
      systemId: 'sprinkler-1',
      enabled: true,
      days: ['Daily'],
    },
  ]);

  const [totalWaterUsed, setTotalWaterUsed] = useState(2340); // Liters today
  const [recycledWaterUsed, setRecycledWaterUsed] = useState(890); // Liters today

  useEffect(() => {
    // Simulate real-time updates for running systems
    const interval = setInterval(() => {
      setSystems(prev => prev.map(system => {
        if (system.status === 'running' && system.duration > 0) {
          return {
            ...system,
            duration: Math.max(0, system.duration - 1),
            status: system.duration <= 1 ? 'stopped' : 'running',
          };
        }
        return system;
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const toggleSystem = (systemId: string) => {
    setSystems(prev => prev.map(system => {
      if (system.id === systemId) {
        const newStatus = system.status === 'running' ? 'stopped' : 'running';
        const newDuration = newStatus === 'running' ? 20 : 0; // Default 20 minutes
        
        Alert.alert(
          'System Control',
          `${system.name} has been ${newStatus === 'running' ? 'started' : 'stopped'}`,
        );

        return {
          ...system,
          status: newStatus,
          duration: newDuration,
        };
      }
      return system;
    }));
  };

  const toggleSchedule = (scheduleId: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, enabled: !schedule.enabled }
        : schedule
    ));
  };

  const getSystemStatusColor = (status: IrrigationSystem['status']) => {
    switch (status) {
      case 'running': return '#22C55E';
      case 'stopped': return '#6B7280';
      case 'scheduled': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getLevelColor = (level: number) => {
    if (level > 60) return '#22C55E';
    if (level > 20) return '#F59E0B';
    return '#EF4444';
  };

  const recyclingEfficiency = Math.round((recycledWaterUsed / totalWaterUsed) * 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Smart Irrigation Control</Text>
        <Text style={styles.subtitle}>Monitor and control your irrigation systems remotely</Text>
      </View>

      {/* Water Usage Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Today's Water Usage</Text>
        <View style={styles.usageGrid}>
          <View style={styles.usageCard}>
            <Droplets size={24} color="#3B82F6" />
            <Text style={styles.usageValue}>{totalWaterUsed}L</Text>
            <Text style={styles.usageLabel}>Total Used</Text>
          </View>
          <View style={styles.usageCard}>
            <Sprout size={24} color="#22C55E" />
            <Text style={styles.usageValue}>{recycledWaterUsed}L</Text>
            <Text style={styles.usageLabel}>Recycled</Text>
          </View>
          <View style={styles.usageCard}>
            <Gauge size={24} color="#F59E0B" />
            <Text style={[styles.usageValue, { color: '#22C55E' }]}>{recyclingEfficiency}%</Text>
            <Text style={styles.usageLabel}>Efficiency</Text>
          </View>
        </View>
      </View>

      {/* Irrigation Systems */}
      <View style={styles.systemsSection}>
        <Text style={styles.sectionTitle}>Irrigation Systems</Text>
        {systems.map(system => (
          <View key={system.id} style={styles.systemCard}>
            <View style={styles.systemHeader}>
              <View style={styles.systemInfo}>
                <View style={styles.systemTitleRow}>
                  {system.type === 'drip' ? (
                    <Droplets size={20} color="#3B82F6" />
                  ) : (
                    <Sprout size={20} color="#22C55E" />
                  )}
                  <Text style={styles.systemName}>{system.name}</Text>
                </View>
                <View style={styles.statusRow}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: getSystemStatusColor(system.status) }
                  ]} />
                  <Text style={[
                    styles.statusText,
                    { color: getSystemStatusColor(system.status) }
                  ]}>
                    {system.status.toUpperCase()}
                  </Text>
                  {system.status === 'running' && (
                    <Text style={styles.durationText}>
                      {system.duration}min remaining
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.controlButton,
                  { backgroundColor: system.status === 'running' ? '#EF4444' : '#22C55E' }
                ]}
                onPress={() => toggleSystem(system.id)}
              >
                <Power size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.systemMetrics}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Flow Rate</Text>
                <Text style={styles.metricValue}>{system.waterFlow} L/min</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Tank Level</Text>
                <Text style={[
                  styles.metricValue,
                  { color: getLevelColor(system.tankLevel) }
                ]}>
                  {system.tankLevel}%
                </Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Pressure</Text>
                <Text style={styles.metricValue}>{system.pressure} PSI</Text>
              </View>
            </View>

            {/* Progress bar for tank level */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Tank Level</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    {
                      width: `${system.tankLevel}%`,
                      backgroundColor: getLevelColor(system.tankLevel),
                    }
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Irrigation Schedule */}
      <View style={styles.scheduleSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Irrigation Schedule</Text>
          <TouchableOpacity style={styles.addButton}>
            <Timer size={16} color="#3B82F6" />
            <Text style={styles.addButtonText}>Add Schedule</Text>
          </TouchableOpacity>
        </View>

        {schedules.map(schedule => {
          const system = systems.find(s => s.id === schedule.systemId);
          return (
            <View key={schedule.id} style={styles.scheduleCard}>
              <View style={styles.scheduleHeader}>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleTime}>{schedule.time}</Text>
                  <Text style={styles.scheduleSystem}>{system?.name}</Text>
                  <Text style={styles.scheduleDays}>
                    {schedule.days.join(', ')} • {schedule.duration}min
                  </Text>
                </View>
                <Switch
                  value={schedule.enabled}
                  onValueChange={() => toggleSchedule(schedule.id)}
                  trackColor={{ false: '#D1D5DB', true: '#BBF7D0' }}
                  thumbColor={schedule.enabled ? '#22C55E' : '#9CA3AF'}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* System Settings */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>System Settings</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Settings size={20} color="#6B7280" />
          <Text style={styles.settingText}>Configure Water Sensors</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Zap size={20} color="#6B7280" />
          <Text style={styles.settingText}>ESP32 Connection Status</Text>
          <View style={styles.connectionIndicator}>
            <View style={[styles.connectionDot, { backgroundColor: '#22C55E' }]} />
            <Text style={styles.connectionText}>Connected</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Battery size={20} color="#6B7280" />
          <Text style={styles.settingText}>Valve Control Settings</Text>
        </TouchableOpacity>
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
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  summarySection: {
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
  usageGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  usageCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  usageValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginVertical: 8,
  },
  usageLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  systemsSection: {
    marginBottom: 20,
  },
  systemCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  systemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  systemInfo: {
    flex: 1,
  },
  systemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  systemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  durationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  systemMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  scheduleSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EBF8FF',
    borderRadius: 6,
  },
  addButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  scheduleSystem: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 2,
  },
  scheduleDays: {
    fontSize: 12,
    color: '#6B7280',
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  connectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectionText: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '600',
  },
});