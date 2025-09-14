import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { User, MapPin, Phone, Mail, Settings, Bell, Shield, CircleHelp as HelpCircle, Globe, Download, Database } from 'lucide-react-native';

interface UserProfile {
  name: string;
  location: string;
  phone: string;
  email: string;
  farmSize: number;
  cropsGrown: string[];
  memberSince: string;
}

interface AppSettings {
  notifications: boolean;
  autoIrrigation: boolean;
  dataSync: boolean;
  language: string;
  units: 'metric' | 'imperial';
}

export default function Profile() {
  const [profile] = useState<UserProfile>({
    name: 'Pemba Sherpa',
    location: 'Gangtok, East Sikkim',
    phone: '+91 98765 43210',
    email: 'pemba.sherpa@example.com',
    farmSize: 2.5,
    cropsGrown: ['Cardamom', 'Ginger', 'Organic Vegetables', 'Apple'],
    memberSince: 'March 2024',
  });

  const [settings, setSettings] = useState<AppSettings>({
    notifications: true,
    autoIrrigation: false,
    dataSync: true,
    language: 'English',
    units: 'metric',
  });

  const [offlineData] = useState({
    soilAnalyses: 12,
    plantScans: 28,
    irrigationLogs: 145,
    lastSync: '2 hours ago',
  });

  const updateSetting = (key: keyof AppSettings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile & Settings</Text>
        <Text style={styles.subtitle}>Manage your account and app preferences</Text>
      </View>

      {/* User Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarPlaceholder}>
            <User size={32} color="#FFFFFF" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{profile.name}</Text>
            <Text style={styles.memberSince}>Member since {profile.memberSince}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Settings size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileDetails}>
          <View style={styles.detailRow}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.detailText}>{profile.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Phone size={16} color="#6B7280" />
            <Text style={styles.detailText}>{profile.phone}</Text>
          </View>
          <View style={styles.detailRow}>
            <Mail size={16} color="#6B7280" />
            <Text style={styles.detailText}>{profile.email}</Text>
          </View>
        </View>

        <View style={styles.farmStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.farmSize} ha</Text>
            <Text style={styles.statLabel}>Farm Size</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.cropsGrown.length}</Text>
            <Text style={styles.statLabel}>Crops Grown</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Analyses Done</Text>
          </View>
        </View>

        <View style={styles.cropsSection}>
          <Text style={styles.cropsLabel}>Current Crops:</Text>
          <View style={styles.cropsList}>
            {profile.cropsGrown.map((crop, index) => (
              <View key={index} style={styles.cropTag}>
                <Text style={styles.cropText}>{crop}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>App Settings</Text>

        <View style={styles.settingGroup}>
          <Text style={styles.groupTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color="#6B7280" />
              <View style={styles.settingText}>
                <Text style={styles.settingName}>Push Notifications</Text>
                <Text style={styles.settingDescription}>
                  Get alerts for soil moisture, tank levels, and plant health
                </Text>
              </View>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => updateSetting('notifications', value)}
              trackColor={{ false: '#D1D5DB', true: '#BBF7D0' }}
              thumbColor={settings.notifications ? '#22C55E' : '#9CA3AF'}
            />
          </View>
        </View>

        <View style={styles.settingGroup}>
          <Text style={styles.groupTitle}>Automation</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Shield size={20} color="#6B7280" />
              <View style={styles.settingText}>
                <Text style={styles.settingName}>Auto Irrigation</Text>
                <Text style={styles.settingDescription}>
                  Automatically control pumps based on soil moisture levels
                </Text>
              </View>
            </View>
            <Switch
              value={settings.autoIrrigation}
              onValueChange={(value) => updateSetting('autoIrrigation', value)}
              trackColor={{ false: '#D1D5DB', true: '#BBF7D0' }}
              thumbColor={settings.autoIrrigation ? '#22C55E' : '#9CA3AF'}
            />
          </View>
        </View>

        <View style={styles.settingGroup}>
          <Text style={styles.groupTitle}>Data & Sync</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Database size={20} color="#6B7280" />
              <View style={styles.settingText}>
                <Text style={styles.settingName}>Auto Data Sync</Text>
                <Text style={styles.settingDescription}>
                  Automatically sync data when internet is available
                </Text>
              </View>
            </View>
            <Switch
              value={settings.dataSync}
              onValueChange={(value) => updateSetting('dataSync', value)}
              trackColor={{ false: '#D1D5DB', true: '#BBF7D0' }}
              thumbColor={settings.dataSync ? '#22C55E' : '#9CA3AF'}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Globe size={20} color="#6B7280" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>Language</Text>
              <Text style={styles.settingDescription}>
                Choose your preferred language
              </Text>
            </View>
          </View>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>{settings.language}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Offline Data Status */}
      <View style={styles.offlineSection}>
        <Text style={styles.sectionTitle}>Offline Data Status</Text>
        
        <View style={styles.offlineStats}>
          <View style={styles.offlineStatItem}>
            <Text style={styles.offlineStatValue}>{offlineData.soilAnalyses}</Text>
            <Text style={styles.offlineStatLabel}>Soil Analyses</Text>
          </View>
          <View style={styles.offlineStatItem}>
            <Text style={styles.offlineStatValue}>{offlineData.plantScans}</Text>
            <Text style={styles.offlineStatLabel}>Plant Scans</Text>
          </View>
          <View style={styles.offlineStatItem}>
            <Text style={styles.offlineStatValue}>{offlineData.irrigationLogs}</Text>
            <Text style={styles.offlineStatLabel}>Irrigation Logs</Text>
          </View>
        </View>

        <View style={styles.syncStatus}>
          <Text style={styles.syncLabel}>Last Sync: {offlineData.lastSync}</Text>
          <TouchableOpacity style={styles.syncButton}>
            <Download size={16} color="#3B82F6" />
            <Text style={styles.syncButtonText}>Sync Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Support & Help */}
      <View style={styles.supportSection}>
        <Text style={styles.sectionTitle}>Support & Help</Text>
        
        <TouchableOpacity style={styles.supportItem}>
          <HelpCircle size={20} color="#6B7280" />
          <Text style={styles.supportText}>Help & Documentation</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportItem}>
          <Phone size={20} color="#6B7280" />
          <Text style={styles.supportText}>Contact Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportItem}>
          <Globe size={20} color="#6B7280" />
          <Text style={styles.supportText}>Visit Sikkim Agriculture Portal</Text>
        </TouchableOpacity>
      </View>

      {/* App Version */}
      <View style={styles.versionSection}>
        <Text style={styles.versionText}>Sikkim Precision Farming v1.0.0</Text>
        <Text style={styles.versionSubtext}>Built for hill farming success</Text>
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
  profileCard: {
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  memberSince: {
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    padding: 8,
    backgroundColor: '#EBF8FF',
    borderRadius: 6,
  },
  profileDetails: {
    marginBottom: 20,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
  },
  farmStats: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 16,
  },
  cropsSection: {},
  cropsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  cropsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cropTag: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  cropText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '600',
  },
  settingsSection: {
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
  settingGroup: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  settingValue: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  settingValueText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '600',
  },
  offlineSection: {
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
  offlineStats: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
  },
  offlineStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  offlineStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  offlineStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  syncStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  syncLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  syncButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  supportSection: {
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
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  supportText: {
    fontSize: 16,
    color: '#1F2937',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});