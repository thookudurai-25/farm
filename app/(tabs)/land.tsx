import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Map,
  MapPin,
  Ruler,
  Mountain,
  TreePine,
  Calendar,
  TrendingUp,
} from 'lucide-react-native';

interface LandPlot {
  id: string;
  name: string;
  location: string;
  area: number; // in hectares
  elevation: number; // in meters
  soilType: string;
  availability: 'available' | 'occupied' | 'reserved';
  price: number; // per hectare per month
  features: string[];
  coordinates: { lat: number; lng: number };
  slope: number; // in degrees
  waterAccess: boolean;
}

interface CultivationPlan {
  plotId: string;
  crop: string;
  season: string;
  expectedYield: number;
  investment: number;
  estimatedProfit: number;
}

export default function LandAvailability() {
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [cultivationPlan, setCultivationPlan] = useState<CultivationPlan | null>(null);

  const [landPlots] = useState<LandPlot[]>([
    {
      id: 'plot-1',
      name: 'Gangtok Valley Plot A',
      location: 'Gangtok, East Sikkim',
      area: 2.5,
      elevation: 1650,
      soilType: 'Loamy Clay',
      availability: 'available',
      price: 12000,
      features: ['Water Access', 'Road Access', 'Terraced', 'South Facing'],
      coordinates: { lat: 27.3389, lng: 88.6065 },
      slope: 15,
      waterAccess: true,
    },
    {
      id: 'plot-2',
      name: 'Namchi Highland Farm',
      location: 'Namchi, South Sikkim',
      area: 3.2,
      elevation: 1875,
      soilType: 'Sandy Loam',
      availability: 'available',
      price: 9500,
      features: ['Mountain View', 'Organic Certified', 'Greenhouse Ready'],
      coordinates: { lat: 27.1644, lng: 88.3615 },
      slope: 22,
      waterAccess: false,
    },
    {
      id: 'plot-3',
      name: 'Pelling Organic Fields',
      location: 'Pelling, West Sikkim',
      area: 1.8,
      elevation: 2100,
      soilType: 'Clay Loam',
      availability: 'occupied',
      price: 15000,
      features: ['High Altitude', 'Cold Resistant Crops', 'Premium Location'],
      coordinates: { lat: 27.2167, lng: 88.2167 },
      slope: 18,
      waterAccess: true,
    },
    {
      id: 'plot-4',
      name: 'Yuksom Valley Estate',
      location: 'Yuksom, West Sikkim',
      area: 4.1,
      elevation: 1780,
      soilType: 'Rich Humus',
      availability: 'available',
      price: 11000,
      features: ['Large Area', 'Forest Adjacent', 'Multiple Crops Suitable'],
      coordinates: { lat: 27.3667, lng: 88.2000 },
      slope: 12,
      waterAccess: true,
    },
    {
      id: 'plot-5',
      name: 'Ravangla Terraces',
      location: 'Ravangla, South Sikkim',
      area: 2.0,
      elevation: 2100,
      soilType: 'Mountain Soil',
      availability: 'reserved',
      price: 13500,
      features: ['Perfect Terracing', 'Medicinal Plants', 'Tourist Area'],
      coordinates: { lat: 27.2833, lng: 88.3167 },
      slope: 25,
      waterAccess: true,
    },
  ]);

  const getAvailabilityColor = (availability: LandPlot['availability']) => {
    switch (availability) {
      case 'available': return '#22C55E';
      case 'occupied': return '#EF4444';
      case 'reserved': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const selectPlot = (plotId: string) => {
    setSelectedPlot(plotId);
    const plot = landPlots.find(p => p.id === plotId);
    if (plot && plot.availability === 'available') {
      // Generate cultivation plan
      const crops = ['Cardamom', 'Ginger', 'Turmeric', 'Organic Vegetables', 'Tea'];
      const randomCrop = crops[Math.floor(Math.random() * crops.length)];
      
      const plan: CultivationPlan = {
        plotId: plotId,
        crop: randomCrop,
        season: 'Kharif 2024',
        expectedYield: plot.area * (2 + Math.random() * 3), // tons
        investment: plot.area * (50000 + Math.random() * 30000), // INR
        estimatedProfit: 0,
      };
      plan.estimatedProfit = plan.expectedYield * (15000 + Math.random() * 10000) - plan.investment;
      
      setCultivationPlan(plan);
    }
  };

  const reservePlot = (plotId: string) => {
    Alert.alert(
      'Reserve Land Plot',
      'Would you like to reserve this plot for cultivation planning?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reserve',
          onPress: () => {
            Alert.alert('Success', 'Plot has been reserved for 7 days. You can now plan your cultivation.');
          },
        },
      ]
    );
  };

  const getSlopeDescription = (slope: number) => {
    if (slope < 10) return 'Gentle slope - Easy farming';
    if (slope < 20) return 'Moderate slope - Terracing recommended';
    return 'Steep slope - Advanced terracing required';
  };

  const getElevationCategory = (elevation: number) => {
    if (elevation < 1500) return 'Low Hills';
    if (elevation < 2000) return 'Mid Hills';
    return 'High Hills';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Land Availability - Sikkim</Text>
        <Text style={styles.subtitle}>Discover and plan cultivation on available hill plots</Text>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapSection}>
        <View style={styles.mapPlaceholder}>
          <Map size={48} color="#3B82F6" />
          <Text style={styles.mapText}>Interactive Map View</Text>
          <Text style={styles.mapSubtext}>
            Tap on plots to view details and availability
          </Text>
        </View>
      </View>

      {/* Land Plots List */}
      <View style={styles.plotsSection}>
        <Text style={styles.sectionTitle}>Available Land Plots</Text>
        {landPlots.map(plot => (
          <TouchableOpacity
            key={plot.id}
            style={[
              styles.plotCard,
              selectedPlot === plot.id && styles.selectedPlot,
              plot.availability !== 'available' && styles.unavailablePlot,
            ]}
            onPress={() => selectPlot(plot.id)}
            disabled={plot.availability !== 'available'}
          >
            <View style={styles.plotHeader}>
              <View style={styles.plotInfo}>
                <Text style={styles.plotName}>{plot.name}</Text>
                <View style={styles.locationRow}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.plotLocation}>{plot.location}</Text>
                </View>
              </View>
              <View style={styles.availabilityBadge}>
                <View style={[
                  styles.availabilityDot,
                  { backgroundColor: getAvailabilityColor(plot.availability) }
                ]} />
                <Text style={[
                  styles.availabilityText,
                  { color: getAvailabilityColor(plot.availability) }
                ]}>
                  {plot.availability.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.plotDetails}>
              <View style={styles.detailRow}>
                <Ruler size={16} color="#6B7280" />
                <Text style={styles.detailText}>{plot.area} hectares</Text>
              </View>
              <View style={styles.detailRow}>
                <Mountain size={16} color="#6B7280" />
                <Text style={styles.detailText}>
                  {plot.elevation}m • {getElevationCategory(plot.elevation)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <TreePine size={16} color="#6B7280" />
                <Text style={styles.detailText}>
                  {plot.slope}° slope • {getSlopeDescription(plot.slope)}
                </Text>
              </View>
            </View>

            <View style={styles.plotFeatures}>
              <Text style={styles.featuresLabel}>Key Features:</Text>
              <View style={styles.featuresList}>
                {plot.features.map((feature, index) => (
                  <View key={index} style={styles.featureTag}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.plotFooter}>
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Lease Price</Text>
                <Text style={styles.priceValue}>₹{plot.price.toLocaleString()}/month</Text>
              </View>
              {plot.availability === 'available' && (
                <TouchableOpacity
                  style={styles.reserveButton}
                  onPress={() => reservePlot(plot.id)}
                >
                  <Calendar size={16} color="#FFFFFF" />
                  <Text style={styles.reserveButtonText}>Reserve</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Cultivation Planning */}
      {cultivationPlan && (
        <View style={styles.planningSection}>
          <View style={styles.planningHeader}>
            <TrendingUp size={24} color="#22C55E" />
            <Text style={styles.sectionTitle}>Cultivation Plan Simulation</Text>
          </View>

          <View style={styles.planCard}>
            <View style={styles.planDetails}>
              <View style={styles.planRow}>
                <Text style={styles.planLabel}>Recommended Crop:</Text>
                <Text style={styles.planValue}>{cultivationPlan.crop}</Text>
              </View>
              <View style={styles.planRow}>
                <Text style={styles.planLabel}>Season:</Text>
                <Text style={styles.planValue}>{cultivationPlan.season}</Text>
              </View>
              <View style={styles.planRow}>
                <Text style={styles.planLabel}>Expected Yield:</Text>
                <Text style={styles.planValue}>{cultivationPlan.expectedYield.toFixed(1)} tons</Text>
              </View>
              <View style={styles.planRow}>
                <Text style={styles.planLabel}>Initial Investment:</Text>
                <Text style={styles.planValue}>₹{cultivationPlan.investment.toLocaleString()}</Text>
              </View>
              <View style={styles.planRow}>
                <Text style={styles.planLabel}>Estimated Profit:</Text>
                <Text style={[
                  styles.planValue,
                  { color: cultivationPlan.estimatedProfit > 0 ? '#22C55E' : '#EF4444' }
                ]}>
                  ₹{cultivationPlan.estimatedProfit.toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.profitabilityIndicator}>
              <Text style={styles.profitabilityLabel}>Profitability Index</Text>
              <View style={styles.profitabilityBar}>
                <View style={[
                  styles.profitabilityFill,
                  {
                    width: `${Math.min(100, Math.max(0, 
                      (cultivationPlan.estimatedProfit / cultivationPlan.investment) * 100 + 50
                    ))}%`,
                    backgroundColor: cultivationPlan.estimatedProfit > 0 ? '#22C55E' : '#EF4444',
                  }
                ]} />
              </View>
              <Text style={styles.profitabilityText}>
                {cultivationPlan.estimatedProfit > 0 ? 'Profitable' : 'Requires Review'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Tips for Hill Farming */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Hill Farming Tips for Sikkim</Text>
        <View style={styles.tipsList}>
          <Text style={styles.tipText}>• Consider elevation and climate when choosing crops</Text>
          <Text style={styles.tipText}>• Terracing is essential for slopes above 15 degrees</Text>
          <Text style={styles.tipText}>• Cardamom and ginger are highly profitable in Sikkim hills</Text>
          <Text style={styles.tipText}>• Organic certification adds 30-40% premium to produce</Text>
          <Text style={styles.tipText}>• Water conservation systems are crucial at high elevations</Text>
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
  mapSection: {
    marginBottom: 20,
  },
  mapPlaceholder: {
    backgroundColor: '#FFFFFF',
    height: 200,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginTop: 12,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  plotsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  plotCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlot: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  unavailablePlot: {
    opacity: 0.6,
  },
  plotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  plotInfo: {
    flex: 1,
  },
  plotName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  plotLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  plotDetails: {
    marginBottom: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
  },
  plotFeatures: {
    marginBottom: 16,
  },
  featuresLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  featureTag: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
  },
  plotFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  reserveButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  reserveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  planningSection: {
    marginBottom: 20,
  },
  planningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planDetails: {
    marginBottom: 20,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  planLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  planValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  profitabilityIndicator: {
    alignItems: 'center',
  },
  profitabilityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  profitabilityBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  profitabilityFill: {
    height: '100%',
    borderRadius: 4,
  },
  profitabilityText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  tipsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsList: {
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});