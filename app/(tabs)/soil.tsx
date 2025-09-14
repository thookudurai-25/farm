import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Beaker, Calculator, MapPin, ArrowRight } from 'lucide-react-native';

type SoilType = 'loamy' | 'sandy' | 'clay' | 'silt' | 'unknown';

interface SoilAnalysis {
  type: SoilType;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
}

interface MixRecommendation {
  cocopeat: number; // in kg
  hydrogel: number; // in kg  
  instructions: string[];
}

export default function SoilAnalysis() {
  const [landArea, setLandArea] = useState('');
  const [soilDepth, setSoilDepth] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [soilAnalysis, setSoilAnalysis] = useState<SoilAnalysis | null>(null);
  const [mixRecommendation, setMixRecommendation] = useState<MixRecommendation | null>(null);

  const soilTypes = [
    { type: 'loamy' as SoilType, name: 'Loamy Soil', color: '#A3A3A3', description: 'Well-balanced, ideal for most crops' },
    { type: 'sandy' as SoilType, name: 'Sandy Soil', color: '#FDE047', description: 'Good drainage, needs more water retention' },
    { type: 'clay' as SoilType, name: 'Clay Soil', color: '#DC2626', description: 'High nutrient retention, drainage issues' },
    { type: 'silt' as SoilType, name: 'Silt Soil', color: '#EA580C', description: 'Fine particles, moderate drainage' },
  ];

  const analyzeSoil = async () => {
    if (!landArea || !soilDepth) {
      Alert.alert('Input Required', 'Please enter both land area and soil depth');
      return;
    }

    setAnalyzing(true);

    // Simulate ML analysis
    setTimeout(() => {
      // Mock ML result - in real app this would call your ML API
      const mockAnalysis: SoilAnalysis = {
        type: 'clay', // Most common in Sikkim hills
        ph: 6.2,
        nitrogen: 45,
        phosphorus: 32,
        potassium: 28,
        organicMatter: 3.2,
      };

      const area = parseFloat(landArea);
      const depth = parseFloat(soilDepth);
      
      // Calculate mix requirements based on soil type and area
      const cocopeatePerSqm = mockAnalysis.type === 'clay' ? 2.5 : mockAnalysis.type === 'sandy' ? 1.5 : 2.0;
      const hydrogelPerSqm = mockAnalysis.type === 'sandy' ? 0.3 : mockAnalysis.type === 'clay' ? 0.15 : 0.2;

      const totalCocopeat = area * cocopeatePerSqm * (depth / 30); // Adjust for depth
      const totalHydrogel = area * hydrogelPerSqm * (depth / 30);

      const recommendation: MixRecommendation = {
        cocopeat: totalCocopeat,
        hydrogel: totalHydrogel,
        instructions: [
          `Mix ${totalCocopeat.toFixed(1)}kg cocopeat evenly throughout the soil`,
          `Distribute ${totalHydrogel.toFixed(2)}kg hydrogel crystals uniformly`,
          'Water thoroughly after mixing to activate hydrogel',
          'Allow 24-48 hours before planting',
          'Ideal for clay soil improvement in hilly terrain',
        ],
      };

      setSoilAnalysis(mockAnalysis);
      setMixRecommendation(recommendation);
      setAnalyzing(false);
    }, 2000);
  };

  const getSoilColor = (type: SoilType) => {
    const soil = soilTypes.find(s => s.type === type);
    return soil?.color || '#6B7280';
  };

  const getSoilName = (type: SoilType) => {
    const soil = soilTypes.find(s => s.type === type);
    return soil?.name || 'Unknown Soil';
  };

  const getHealthStatus = (value: number, type: 'ph' | 'nutrient') => {
    if (type === 'ph') {
      if (value >= 6.0 && value <= 7.0) return { status: 'Optimal', color: '#22C55E' };
      if (value >= 5.5 && value <= 7.5) return { status: 'Good', color: '#F59E0B' };
      return { status: 'Needs Adjustment', color: '#EF4444' };
    } else {
      if (value >= 40) return { status: 'High', color: '#22C55E' };
      if (value >= 20) return { status: 'Medium', color: '#F59E0B' };
      return { status: 'Low', color: '#EF4444' };
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Soil Analysis & Mix Calculator</Text>
        <Text style={styles.subtitle}>Optimize your soil for hilly region farming</Text>
      </View>

      {/* Input Form */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Land Details</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Land Area (m²)</Text>
          <TextInput
            style={styles.input}
            value={landArea}
            onChangeText={setLandArea}
            placeholder="Enter area in square meters"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Soil Depth (cm)</Text>
          <TextInput
            style={styles.input}
            value={soilDepth}
            onChangeText={setSoilDepth}
            placeholder="Enter depth for cultivation"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={[styles.analyzeButton, analyzing && styles.analyzeButtonDisabled]}
          onPress={analyzeSoil}
          disabled={analyzing}
        >
          <Beaker size={20} color="#FFFFFF" />
          <Text style={styles.analyzeButtonText}>
            {analyzing ? 'Analyzing Soil...' : 'Analyze Soil'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Soil Analysis Results */}
      {soilAnalysis && (
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Soil Analysis Results</Text>
          
          <View style={styles.soilTypeCard}>
            <View style={styles.soilTypeHeader}>
              <View 
                style={[styles.soilTypeDot, { backgroundColor: getSoilColor(soilAnalysis.type) }]} 
              />
              <Text style={styles.soilTypeName}>{getSoilName(soilAnalysis.type)}</Text>
              <MapPin size={16} color="#6B7280" />
            </View>
            <Text style={styles.soilTypeDescription}>
              {soilTypes.find(s => s.type === soilAnalysis.type)?.description}
            </Text>
          </View>

          {/* Soil Parameters */}
          <View style={styles.parametersGrid}>
            <View style={styles.parameterCard}>
              <Text style={styles.parameterLabel}>pH Level</Text>
              <Text style={[
                styles.parameterValue,
                { color: getHealthStatus(soilAnalysis.ph, 'ph').color }
              ]}>
                {soilAnalysis.ph.toFixed(1)}
              </Text>
              <Text style={[
                styles.parameterStatus,
                { color: getHealthStatus(soilAnalysis.ph, 'ph').color }
              ]}>
                {getHealthStatus(soilAnalysis.ph, 'ph').status}
              </Text>
            </View>

            <View style={styles.parameterCard}>
              <Text style={styles.parameterLabel}>Nitrogen (N)</Text>
              <Text style={[
                styles.parameterValue,
                { color: getHealthStatus(soilAnalysis.nitrogen, 'nutrient').color }
              ]}>
                {soilAnalysis.nitrogen}%
              </Text>
              <Text style={[
                styles.parameterStatus,
                { color: getHealthStatus(soilAnalysis.nitrogen, 'nutrient').color }
              ]}>
                {getHealthStatus(soilAnalysis.nitrogen, 'nutrient').status}
              </Text>
            </View>

            <View style={styles.parameterCard}>
              <Text style={styles.parameterLabel}>Phosphorus (P)</Text>
              <Text style={[
                styles.parameterValue,
                { color: getHealthStatus(soilAnalysis.phosphorus, 'nutrient').color }
              ]}>
                {soilAnalysis.phosphorus}%
              </Text>
              <Text style={[
                styles.parameterStatus,
                { color: getHealthStatus(soilAnalysis.phosphorus, 'nutrient').color }
              ]}>
                {getHealthStatus(soilAnalysis.phosphorus, 'nutrient').status}
              </Text>
            </View>

            <View style={styles.parameterCard}>
              <Text style={styles.parameterLabel}>Potassium (K)</Text>
              <Text style={[
                styles.parameterValue,
                { color: getHealthStatus(soilAnalysis.potassium, 'nutrient').color }
              ]}>
                {soilAnalysis.potassium}%
              </Text>
              <Text style={[
                styles.parameterStatus,
                { color: getHealthStatus(soilAnalysis.potassium, 'nutrient').color }
              ]}>
                {getHealthStatus(soilAnalysis.potassium, 'nutrient').status}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Mix Recommendations */}
      {mixRecommendation && (
        <View style={styles.recommendationSection}>
          <View style={styles.recommendationHeader}>
            <Calculator size={24} color="#22C55E" />
            <Text style={styles.sectionTitle}>Mix Recommendations</Text>
          </View>

          <View style={styles.mixCards}>
            <View style={styles.mixCard}>
              <Text style={styles.mixTitle}>Cocopeat Required</Text>
              <Text style={styles.mixAmount}>{mixRecommendation.cocopeat.toFixed(1)} kg</Text>
              <Text style={styles.mixDescription}>For soil structure improvement</Text>
            </View>

            <View style={styles.mixCard}>
              <Text style={styles.mixTitle}>Hydrogel Required</Text>
              <Text style={styles.mixAmount}>{mixRecommendation.hydrogel.toFixed(2)} kg</Text>
              <Text style={styles.mixDescription}>For water retention enhancement</Text>
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Application Instructions</Text>
            {mixRecommendation.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionRow}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
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
  inputSection: {
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
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  analyzeButton: {
    backgroundColor: '#22C55E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsSection: {
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
  soilTypeCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  soilTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  soilTypeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  soilTypeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  soilTypeDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  parametersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  parameterCard: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  parameterLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '600',
  },
  parameterValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  parameterStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  recommendationSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  mixCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  mixCard: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#BBF7D0',
    alignItems: 'center',
  },
  mixTitle: {
    fontSize: 14,
    color: '#15803D',
    marginBottom: 8,
    fontWeight: '600',
  },
  mixAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803D',
    marginBottom: 4,
  },
  mixDescription: {
    fontSize: 12,
    color: '#16A34A',
    textAlign: 'center',
  },
  instructionsContainer: {
    marginTop: 8,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  instructionNumber: {
    backgroundColor: '#22C55E',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});