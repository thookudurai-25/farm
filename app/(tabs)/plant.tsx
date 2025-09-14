import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Camera, Upload, Leaf, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Clock } from 'lucide-react-native';

interface PlantAnalysis {
  species: string;
  healthStatus: 'healthy' | 'pest-infected' | 'nutrient-deficient' | 'disease';
  confidence: number;
  issues: string[];
  recommendations: string[];
  treatments: Treatment[];
}

interface Treatment {
  type: 'organic' | 'chemical' | 'cultural';
  name: string;
  description: string;
  application: string;
}

export default function PlantHealth() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PlantAnalysis | null>(null);

  const capturePhoto = () => {
    Alert.alert(
      'Capture Plant Image',
      'Choose an option to analyze your plant',
      [
        { text: 'Camera', onPress: () => handleImageCapture('camera') },
        { text: 'Gallery', onPress: () => handleImageCapture('gallery') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleImageCapture = async (source: 'camera' | 'gallery') => {
    // In a real app, this would use expo-image-picker
    // For demo, we'll use a placeholder image
    const placeholderImage = 'https://images.pexels.com/photos/1084188/pexels-photo-1084188.jpeg?auto=compress&cs=tinysrgb&w=400';
    setSelectedImage(placeholderImage);
    
    // Simulate ML analysis
    setAnalyzing(true);
    setTimeout(() => {
      const mockAnalysis: PlantAnalysis = {
        species: 'Tomato Plant (Solanum lycopersicum)',
        healthStatus: 'pest-infected',
        confidence: 87,
        issues: [
          'Early signs of aphid infestation detected',
          'Slight yellowing of lower leaves indicating possible nitrogen deficiency',
          'Leaf curl virus symptoms observed'
        ],
        recommendations: [
          'Apply neem oil spray for aphid control',
          'Increase nitrogen fertilization gradually',
          'Remove affected leaves to prevent virus spread',
          'Improve air circulation around plants',
          'Monitor daily for pest progression'
        ],
        treatments: [
          {
            type: 'organic',
            name: 'Neem Oil Treatment',
            description: 'Natural pesticide effective against aphids and soft-bodied insects',
            application: 'Mix 2ml neem oil per liter of water. Spray in early morning or evening'
          },
          {
            type: 'organic',
            name: 'Compost Tea',
            description: 'Organic nitrogen boost for nutrient-deficient plants',
            application: 'Apply 500ml per plant weekly, water around root zone'
          },
          {
            type: 'cultural',
            name: 'Pruning & Sanitation',
            description: 'Remove infected plant material to prevent disease spread',
            application: 'Cut affected leaves with sterilized tools, dispose away from garden'
          }
        ]
      };
      
      setAnalysis(mockAnalysis);
      setAnalyzing(false);
    }, 2500);
  };

  const getHealthStatusColor = (status: PlantAnalysis['healthStatus']) => {
    switch (status) {
      case 'healthy': return '#22C55E';
      case 'pest-infected': return '#EF4444';
      case 'nutrient-deficient': return '#F59E0B';
      case 'disease': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getHealthStatusIcon = (status: PlantAnalysis['healthStatus']) => {
    switch (status) {
      case 'healthy': return <CheckCircle size={20} color="#22C55E" />;
      case 'pest-infected': return <AlertCircle size={20} color="#EF4444" />;
      case 'nutrient-deficient': return <Clock size={20} color="#F59E0B" />;
      case 'disease': return <AlertCircle size={20} color="#DC2626" />;
    }
  };

  const getTreatmentColor = (type: Treatment['type']) => {
    switch (type) {
      case 'organic': return '#22C55E';
      case 'chemical': return '#3B82F6';
      case 'cultural': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Plant Health Detection</Text>
        <Text style={styles.subtitle}>AI-powered plant disease and pest identification</Text>
      </View>

      {/* Image Capture Section */}
      <View style={styles.captureSection}>
        <Text style={styles.sectionTitle}>Capture Plant Image</Text>
        
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity style={styles.retakeButton} onPress={capturePhoto}>
              <Camera size={16} color="#FFFFFF" />
              <Text style={styles.retakeButtonText}>Retake Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
            <Camera size={32} color="#22C55E" />
            <Text style={styles.captureButtonTitle}>Take Plant Photo</Text>
            <Text style={styles.captureButtonSubtitle}>
              Position the camera to capture the affected plant parts clearly
            </Text>
          </TouchableOpacity>
        )}

        {selectedImage && !analysis && !analyzing && (
          <TouchableOpacity 
            style={styles.analyzeButton} 
            onPress={() => handleImageCapture('camera')}
          >
            <Leaf size={20} color="#FFFFFF" />
            <Text style={styles.analyzeButtonText}>Analyze Plant Health</Text>
          </TouchableOpacity>
        )}

        {analyzing && (
          <View style={styles.analyzingContainer}>
            <View style={styles.loadingSpinner}>
              <Leaf size={24} color="#22C55E" />
            </View>
            <Text style={styles.analyzingText}>Analyzing plant health...</Text>
            <Text style={styles.analyzingSubtext}>
              Our AI is examining your plant for diseases, pests, and nutrient deficiencies
            </Text>
          </View>
        )}
      </View>

      {/* Analysis Results */}
      {analysis && (
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Analysis Results</Text>

          {/* Plant Species & Health Status */}
          <View style={styles.speciesCard}>
            <View style={styles.speciesHeader}>
              <Leaf size={24} color="#22C55E" />
              <View style={styles.speciesInfo}>
                <Text style={styles.speciesName}>{analysis.species}</Text>
                <View style={styles.healthStatus}>
                  {getHealthStatusIcon(analysis.healthStatus)}
                  <Text style={[
                    styles.healthStatusText,
                    { color: getHealthStatusColor(analysis.healthStatus) }
                  ]}>
                    {analysis.healthStatus.replace('-', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.confidenceScore}>
                <Text style={styles.confidenceLabel}>Confidence</Text>
                <Text style={styles.confidenceValue}>{analysis.confidence}%</Text>
              </View>
            </View>
          </View>

          {/* Issues Detected */}
          <View style={styles.issuesSection}>
            <Text style={styles.subsectionTitle}>Issues Detected</Text>
            {analysis.issues.map((issue, index) => (
              <View key={index} style={styles.issueRow}>
                <AlertCircle size={16} color="#EF4444" />
                <Text style={styles.issueText}>{issue}</Text>
              </View>
            ))}
          </View>

          {/* Recommendations */}
          <View style={styles.recommendationsSection}>
            <Text style={styles.subsectionTitle}>Recommendations</Text>
            {analysis.recommendations.map((recommendation, index) => (
              <View key={index} style={styles.recommendationRow}>
                <View style={styles.recommendationNumber}>
                  <Text style={styles.recommendationNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.recommendationText}>{recommendation}</Text>
              </View>
            ))}
          </View>

          {/* Treatment Options */}
          <View style={styles.treatmentsSection}>
            <Text style={styles.subsectionTitle}>Treatment Options</Text>
            {analysis.treatments.map((treatment, index) => (
              <View key={index} style={styles.treatmentCard}>
                <View style={styles.treatmentHeader}>
                  <View style={[
                    styles.treatmentTypeBadge,
                    { backgroundColor: getTreatmentColor(treatment.type) }
                  ]}>
                    <Text style={styles.treatmentTypeText}>
                      {treatment.type.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.treatmentName}>{treatment.name}</Text>
                </View>
                <Text style={styles.treatmentDescription}>{treatment.description}</Text>
                <View style={styles.applicationContainer}>
                  <Text style={styles.applicationLabel}>Application:</Text>
                  <Text style={styles.applicationText}>{treatment.application}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Tips Section */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Photography Tips</Text>
        <View style={styles.tipsList}>
          <Text style={styles.tipText}>• Capture images in natural daylight for best results</Text>
          <Text style={styles.tipText}>• Focus on affected areas like spots, discoloration, or pests</Text>
          <Text style={styles.tipText}>• Include both affected and healthy parts for comparison</Text>
          <Text style={styles.tipText}>• Avoid blurry images - keep the camera steady</Text>
          <Text style={styles.tipText}>• Multiple angles can improve diagnosis accuracy</Text>
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
  captureSection: {
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
  captureButton: {
    borderWidth: 2,
    borderColor: '#22C55E',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
  },
  captureButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22C55E',
    marginTop: 12,
    marginBottom: 8,
  },
  captureButtonSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  retakeButton: {
    backgroundColor: '#6B7280',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retakeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  analyzeButton: {
    backgroundColor: '#22C55E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  analyzingContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  analyzingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  analyzingSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
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
  speciesCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  speciesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  speciesInfo: {
    flex: 1,
  },
  speciesName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  healthStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  healthStatusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  confidenceScore: {
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  confidenceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  issuesSection: {
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  issueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  issueText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  recommendationsSection: {
    marginBottom: 20,
  },
  recommendationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  recommendationNumber: {
    backgroundColor: '#22C55E',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  treatmentsSection: {
    marginBottom: 20,
  },
  treatmentCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  treatmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  treatmentTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  treatmentTypeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  treatmentDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  applicationContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 6,
  },
  applicationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  applicationText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 18,
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