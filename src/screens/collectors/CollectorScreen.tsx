import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { collectorScreenStyles } from '../../../src/styles/collectors/CollectorScreenStyles';
import ProfileHeader from '../../components/ProfileHeader';

interface Collection {
  id: string;
  material: string;
  materialName: string;
  materialColor: string;
  materialIcon: string;
  address: string;
  photo: string;
  distance: number;
  points: number;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  user: {
    name: string;
    avatar: string;
  };
}

interface CollectorScreenProps {
  navigation: any;
}

export default function CollectorScreen({ navigation }: CollectorScreenProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'in_progress'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  // Dados mockados para demonstração
  const mockCollections: Collection[] = [
    {
      id: '1',
      material: 'paper',
      materialName: 'Papel',
      materialColor: '#00D1FF',
      materialIcon: '📄',
      address: 'Rua das Flores, 123 - Centro, São Paulo',
      photo: 'https://via.placeholder.com/300x200/00D1FF/FFFFFF?text=Papel',
      distance: 0.8,
      points: 50,
      status: 'pending',
      createdAt: '2024-01-15T10:30:00Z',
      user: {
        name: 'João Silva',
        avatar: 'https://via.placeholder.com/50x50/00FF84/FFFFFF?text=JS'
      }
    },
    {
      id: '2',
      material: 'plastic',
      materialName: 'Plástico',
      materialColor: '#FF6B00',
      materialIcon: '🥤',
      address: 'Av. Paulista, 456 - Bela Vista, São Paulo',
      photo: 'https://via.placeholder.com/300x200/FF6B00/FFFFFF?text=Plástico',
      distance: 1.2,
      points: 75,
      status: 'pending',
      createdAt: '2024-01-15T11:15:00Z',
      user: {
        name: 'Maria Santos',
        avatar: 'https://via.placeholder.com/50x50/00FF84/FFFFFF?text=MS'
      }
    },
    {
      id: '3',
      material: 'glass',
      materialName: 'Vidro',
      materialColor: '#00FF84',
      materialIcon: '🍾',
      address: 'Rua Augusta, 789 - Consolação, São Paulo',
      photo: 'https://via.placeholder.com/300x200/00FF84/FFFFFF?text=Vidro',
      distance: 2.1,
      points: 100,
      status: 'in_progress',
      createdAt: '2024-01-15T09:45:00Z',
      user: {
        name: 'Pedro Costa',
        avatar: 'https://via.placeholder.com/50x50/00FF84/FFFFFF?text=PC'
      }
    },
    {
      id: '4',
      material: 'metal',
      materialName: 'Metal',
      materialColor: '#FFD600',
      materialIcon: '🥫',
      address: 'Rua Oscar Freire, 321 - Jardins, São Paulo',
      photo: 'https://via.placeholder.com/300x200/FFD600/FFFFFF?text=Metal',
      distance: 3.5,
      points: 60,
      status: 'pending',
      createdAt: '2024-01-15T08:20:00Z',
      user: {
        name: 'Ana Oliveira',
        avatar: 'https://via.placeholder.com/50x50/00FF84/FFFFFF?text=AO'
      }
    }
  ];

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = () => {
    setCollections(mockCollections);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadCollections();
      setRefreshing(false);
    }, 1000);
  };

  const handleCollectionPress = (collection: Collection) => {
    // Animação de toque
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    Alert.alert(
      'Detalhes da Coleta',
      `Material: ${collection.materialName}\nEndereço: ${collection.address}\nDistância: ${collection.distance} km\nPontos: ${collection.points}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: collection.status === 'pending' ? 'Aceitar Coleta' : 'Ver Detalhes',
          onPress: () => {
            if (collection.status === 'pending') {
              handleAcceptCollection(collection.id);
            }
          }
        }
      ]
    );
  };

  const handleAcceptCollection = (collectionId: string) => {
    setCollections(prev => 
      prev.map(collection => 
        collection.id === collectionId 
          ? { ...collection, status: 'in_progress' as const }
          : collection
      )
    );
    Alert.alert('Sucesso!', 'Coleta aceita com sucesso!');
  };

  const handleCompleteCollection = (collectionId: string) => {
    setCollections(prev => 
      prev.map(collection => 
        collection.id === collectionId 
          ? { ...collection, status: 'completed' as const }
          : collection
      )
    );
    Alert.alert('Parabéns!', 'Coleta finalizada! Pontos creditados na sua conta.');
  };

  const filteredCollections = collections.filter(collection => {
    if (selectedFilter === 'all') return true;
    return collection.status === selectedFilter;
  });

  const renderHeader = () => (
    <View style={collectorScreenStyles.header}>
      <TouchableOpacity style={collectorScreenStyles.menuButton}>
        <Ionicons name="menu" size={24} color="#333" />
      </TouchableOpacity>
      
      <View style={collectorScreenStyles.titleContainer}>
        <Text style={collectorScreenStyles.title}>Coletas Disponíveis</Text>
        <Text style={collectorScreenStyles.collectorIcon}>🚛</Text>
      </View>
      
      <ProfileHeader 
        navigation={navigation} 
        userType="user" 
        userName="João Silva" 
        userEmail="joao.silva@email.com" 
      />
    </View>
  );

  const renderFilterTabs = () => (
    <View style={collectorScreenStyles.filterContainer}>
      <TouchableOpacity
        style={[
          collectorScreenStyles.filterTab,
          selectedFilter === 'all' && collectorScreenStyles.activeFilterTab
        ]}
        onPress={() => setSelectedFilter('all')}
      >
        <Text style={[
          collectorScreenStyles.filterTabText,
          selectedFilter === 'all' && collectorScreenStyles.activeFilterTabText
        ]}>
          Todas
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          collectorScreenStyles.filterTab,
          selectedFilter === 'pending' && collectorScreenStyles.activeFilterTab
        ]}
        onPress={() => setSelectedFilter('pending')}
      >
        <Text style={[
          collectorScreenStyles.filterTabText,
          selectedFilter === 'pending' && collectorScreenStyles.activeFilterTabText
        ]}>
          Pendentes
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          collectorScreenStyles.filterTab,
          selectedFilter === 'in_progress' && collectorScreenStyles.activeFilterTab
        ]}
        onPress={() => setSelectedFilter('in_progress')}
      >
        <Text style={[
          collectorScreenStyles.filterTabText,
          selectedFilter === 'in_progress' && collectorScreenStyles.activeFilterTabText
        ]}>
          Em Andamento
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCollectionCard = (collection: Collection) => (
    <Animated.View
      key={collection.id}
      style={[
        collectorScreenStyles.collectionCard,
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <TouchableOpacity
        style={collectorScreenStyles.cardContent}
        onPress={() => handleCollectionPress(collection)}
      >
        {/* Header do Card */}
        <View style={collectorScreenStyles.cardHeader}>
          <View style={collectorScreenStyles.materialInfo}>
            <View style={[
              collectorScreenStyles.materialIconContainer,
              { backgroundColor: collection.materialColor }
            ]}>
              <Text style={collectorScreenStyles.materialIconText}>{collection.materialIcon}</Text>
            </View>
            <View>
              <Text style={collectorScreenStyles.materialName}>{collection.materialName}</Text>
              <Text style={collectorScreenStyles.pointsText}>{collection.points} pontos</Text>
            </View>
          </View>
          
          <View style={[
            collectorScreenStyles.statusBadge,
            { backgroundColor: collection.status === 'pending' ? '#FFD600' : '#00FF84' }
          ]}>
            <Text style={collectorScreenStyles.statusText}>
              {collection.status === 'pending' ? 'Pendente' : 'Em Andamento'}
            </Text>
          </View>
        </View>

        {/* Foto do Material */}
        <View style={collectorScreenStyles.photoContainer}>
          <Image source={{ uri: collection.photo }} style={collectorScreenStyles.materialPhoto} />
        </View>

        {/* Informações da Coleta */}
        <View style={collectorScreenStyles.collectionInfo}>
          <View style={collectorScreenStyles.infoRow}>
            <Ionicons name="location" size={16} color="#00D1FF" />
            <Text style={collectorScreenStyles.addressText} numberOfLines={2}>
              {collection.address}
            </Text>
          </View>
          
          <View style={collectorScreenStyles.infoRow}>
            <Ionicons name="navigate" size={16} color="#00FF84" />
            <Text style={collectorScreenStyles.distanceText}>
              {collection.distance} km de distância
            </Text>
          </View>
          
          <View style={collectorScreenStyles.infoRow}>
            <Ionicons name="person" size={16} color="#FFD600" />
            <Text style={collectorScreenStyles.userText}>
              Solicitado por {collection.user.name}
            </Text>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={collectorScreenStyles.actionButtons}>
          {collection.status === 'pending' && (
            <TouchableOpacity
              style={collectorScreenStyles.acceptButton}
              onPress={() => handleAcceptCollection(collection.id)}
            >
              <LinearGradient
                colors={['#00FF84', '#00E676']}
                style={collectorScreenStyles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="checkmark" size={20} color="#000" />
                <Text style={collectorScreenStyles.acceptButtonText}>Aceitar Coleta</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          
          {collection.status === 'in_progress' && (
            <TouchableOpacity
              style={collectorScreenStyles.completeButton}
              onPress={() => handleCompleteCollection(collection.id)}
            >
              <LinearGradient
                colors={['#FFD600', '#FFC107']}
                style={collectorScreenStyles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="trophy" size={20} color="#000" />
                <Text style={collectorScreenStyles.completeButtonText}>Finalizar Coleta</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <View style={collectorScreenStyles.emptyState}>
      <Ionicons name="leaf" size={80} color="#00FF84" />
      <Text style={collectorScreenStyles.emptyTitle}>Nenhuma coleta disponível</Text>
      <Text style={collectorScreenStyles.emptySubtitle}>
        {selectedFilter === 'all' 
          ? 'Não há coletas no momento. Tente novamente mais tarde.'
          : 'Não há coletas com este status no momento.'
        }
      </Text>
      <TouchableOpacity style={collectorScreenStyles.refreshButton} onPress={onRefresh}>
        <Ionicons name="refresh" size={20} color="#00D1FF" />
        <Text style={collectorScreenStyles.refreshButtonText}>Atualizar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={collectorScreenStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      {/* Background Pattern */}
      <View style={collectorScreenStyles.backgroundPattern} />
      
      {renderHeader()}
      
      {renderFilterTabs()}
      
      <ScrollView 
        style={collectorScreenStyles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00FF84"
            colors={['#00FF84']}
          />
        }
      >
        {filteredCollections.length > 0 ? (
          filteredCollections.map(renderCollectionCard)
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
