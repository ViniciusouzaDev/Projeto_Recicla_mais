import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { recycleScreenStyles } from '../../../src/styles/collections/RecycleScreenStyles';
import ProfileHeader from '../../components/ProfileHeader';
import ShareButton from '../../components/ShareButton';
import { collectionService } from '../../services/CollectionService';
import { CollectionRequest } from '../../types/CollectionTypes';

interface Material {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
}

interface RecycleScreenProps {
  navigation: any;
}

export default function RecycleScreen({ navigation }: RecycleScreenProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [activeTab, setActiveTab] = useState('Recycle');
  const [scaleAnim] = useState(new Animated.Value(1));

  // TODO: Implementar reconhecimento de imagem com IA
  // TODO: Adicionar mais tipos de materiais
  // TODO: Implementar sistema de pontuação por material
  // TODO: Adicionar validação de qualidade da foto
  // TODO: Implementar histórico de coletas

  const materials: Material[] = [
    {
      id: 'paper',
      name: 'Papel',
      color: '#00D1FF',
      icon: '📄',
      description: 'Jornais, revistas, caixas'
    },
    {
      id: 'glass',
      name: 'Vidro',
      color: '#00FF84',
      icon: '🍾',
      description: 'Garrafas, potes, frascos'
    },
    {
      id: 'metal',
      name: 'Metal',
      color: '#FFD600',
      icon: '🥫',
      description: 'Latas, panelas, arames'
    },
    {
      id: 'plastic',
      name: 'Plástico',
      color: '#ff0000ff',
      icon: '🥤',
      description: 'Garrafas, embalagens, sacos'
    }
  ];

  const tabs = [
        { id: 'Home', icon: 'home', label: 'Home' },
        { id: 'Trophies', icon: 'trophy', label: 'Troféus' },
        { id: 'Recycle', icon: 'leaf', label: 'Reciclar' },
        { id: 'Collections', icon: 'list', label: 'Coletas' },
        { id: 'Collector', icon: 'car', label: 'Coletador' },
  ];

  useEffect(() => {
    // Solicitar permissões ao carregar a tela
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (locationStatus !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos da permissão de localização para identificar onde está o lixo.');
      }
    } catch (error) {
      console.log('Erro ao solicitar permissões:', error);
    }
  };

  const handleMaterialSelect = (materialId: string) => {
    setSelectedMaterial(materialId);
    
    // Animação de seleção
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
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível abrir a câmera');
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão de localização não concedida');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addressResponse.length > 0) {
        const addr = addressResponse[0];
        const fullAddress = `${addr.street || ''} ${addr.streetNumber || ''}, ${addr.district || ''}, ${addr.city || ''}, ${addr.region || ''}`.trim();
        setAddress(fullAddress);
      }
    } catch (error) {
      console.log('Erro ao obter localização:', error);
      Alert.alert('Erro', 'Não foi possível obter a localização atual');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedMaterial) {
      Alert.alert('Atenção', 'Selecione o tipo de material');
      return;
    }

    if (!photo) {
      Alert.alert('Atenção', 'Tire uma foto do lixo');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Atenção', 'Informe o endereço');
      return;
    }

    try {
      const material = materials.find(m => m.id === selectedMaterial);
      
      // Criar solicitação de coleta
      const collectionRequest = await collectionService.createCollectionRequest({
        userId: 'user_123', // TODO: Obter ID do usuário logado
        materialType: selectedMaterial,
        materialName: material?.name || '',
        photoUri: photo,
        address: address,
        latitude: 0, // TODO: Obter coordenadas reais
        longitude: 0,
      });

      Alert.alert(
        'Sucesso!', 
        `Solicitação de coleta ${material?.name} criada com sucesso!\n\nStatus: ${collectionRequest.status}\n\nEndereço: ${address}\n\nAguarde um coletor aceitar sua solicitação.`,
        [{ text: 'OK', onPress: () => {
          // Reset form
          setSelectedMaterial(null);
          setPhoto(null);
          setAddress('');
        }}]
      );
    } catch (error) {
      console.error('Erro ao criar solicitação de coleta:', error);
      Alert.alert('Erro', 'Não foi possível criar a solicitação de coleta. Tente novamente.');
    }
  };

  const renderHeader = () => (
    <View style={recycleScreenStyles.header}>
      <View style={recycleScreenStyles.titleContainer}>
        <Text style={recycleScreenStyles.title}>Reciclar</Text>
        <Text style={recycleScreenStyles.recycleIcon}>♻️</Text>
      </View>
      
      <ProfileHeader 
        navigation={navigation} 
        userType="user" 
        userName="João Silva" 
        userEmail="joao.silva@email.com" 
      />
    </View>
  );

  const renderMaterialSelection = () => (
    <View style={recycleScreenStyles.section}>
      <Text style={recycleScreenStyles.sectionTitle}>1. Selecione o tipo de material</Text>
      <View style={recycleScreenStyles.materialsGrid}>
        {materials.map((material) => (
          <Animated.View
            key={material.id}
            style={[
              recycleScreenStyles.materialCard,
              {
                backgroundColor: material.color,
                borderWidth: selectedMaterial === material.id ? 4 : 2,
                borderColor: selectedMaterial === material.id ? '#fff' : 'rgba(255,255,255,0.3)',
                transform: [{ scale: selectedMaterial === material.id ? scaleAnim : 1 }],
              }
            ]}
          >
            <TouchableOpacity
              style={recycleScreenStyles.materialButton}
              onPress={() => handleMaterialSelect(material.id)}
            >
              <Text style={recycleScreenStyles.materialIcon}>{material.icon}</Text>
              <Text style={recycleScreenStyles.materialName}>{material.name}</Text>
              <Text style={recycleScreenStyles.materialDescription}>{material.description}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );

  const renderCameraSection = () => (
    <View style={recycleScreenStyles.section}>
      <Text style={recycleScreenStyles.sectionTitle}>2. Tire uma foto do lixo</Text>
      
      {photo ? (
        <View style={recycleScreenStyles.photoContainer}>
          <View style={recycleScreenStyles.photoWrapper}>
            <Image source={{ uri: photo }} style={recycleScreenStyles.photoPreview} />
          </View>
          <TouchableOpacity style={recycleScreenStyles.retakeButton} onPress={takePhoto}>
            <Ionicons name="camera" size={20} color="#000" />
            <Text style={recycleScreenStyles.retakeButtonText}>Tirar Nova Foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={recycleScreenStyles.cameraButton} onPress={takePhoto}>
          <Ionicons name="camera" size={40} color="#00FF84" />
          <Text style={recycleScreenStyles.cameraButtonText}>Tirar Foto</Text>
          <Text style={recycleScreenStyles.cameraButtonSubtext}>Toque para abrir a câmera</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderAddressSection = () => (
    <View style={recycleScreenStyles.section}>
      <Text style={recycleScreenStyles.sectionTitle}>3. Informe o endereço</Text>
      
      <View style={recycleScreenStyles.addressContainer}>
        <View style={recycleScreenStyles.addressInputWrapper}>
          <Ionicons name="location" size={20} color="#00D1FF" style={recycleScreenStyles.addressIcon} />
          <TextInput
            style={recycleScreenStyles.addressInput}
            placeholder="Digite o endereço onde está o lixo..."
            placeholderTextColor="#666"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />
        </View>
        
        <TouchableOpacity
          style={[recycleScreenStyles.locationButton, isLoadingLocation && recycleScreenStyles.locationButtonDisabled]}
          onPress={getCurrentLocation}
          disabled={isLoadingLocation}
        >
          <Ionicons 
            name={isLoadingLocation ? "hourglass" : "location"} 
            size={20} 
            color="#000" 
          />
          <Text style={recycleScreenStyles.locationButtonText}>
            {isLoadingLocation ? 'Obtendo...' : 'Usar Localização Atual'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConfirmButton = () => (
    <View style={recycleScreenStyles.confirmContainer}>
      <TouchableOpacity style={recycleScreenStyles.confirmButton} onPress={handleConfirm}>
        <Ionicons name="checkmark-circle" size={24} color="#000" />
        <Text style={recycleScreenStyles.confirmButtonText}>CONFIRMAR CADASTRO</Text>
      </TouchableOpacity>
      
      {selectedMaterial && photo && address && (
        <ShareButton 
          message={`Acabei de cadastrar um lixo ${materials.find(m => m.id === selectedMaterial)?.name} no Recicla+! Estou fazendo minha parte pela sustentabilidade. Junte-se a mim! #ReciclaMais #Sustentabilidade`}
          title="Compartilhar Coleta"
          style={recycleScreenStyles.shareButton}
        />
      )}
    </View>
  );

  const renderTabBar = () => (
    <View style={recycleScreenStyles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            recycleScreenStyles.tab,
            activeTab === tab.id && recycleScreenStyles.activeTab
          ]}
          onPress={() => {
            setActiveTab(tab.id);
            if (tab.id === 'Home') {
              navigation.navigate('Dashboard');
            } else if (tab.id === 'Trophies') {
              navigation.navigate('Ranking');
            } else if (tab.id === 'Collections') {
              navigation.navigate('CollectionStatus');
            } else if (tab.id === 'Collector') {
              navigation.navigate('Collector');
            }
          }}
        >
          <Ionicons
            name={tab.icon as any}
            size={24}
            color={activeTab === tab.id ? '#00FF84' : '#666'}
          />
          <Text style={[
            recycleScreenStyles.tabLabel,
            activeTab === tab.id && recycleScreenStyles.activeTabLabel
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={recycleScreenStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      {/* Background Pattern */}
      <View style={recycleScreenStyles.backgroundPattern} />
      
      {renderHeader()}
      
      <ScrollView 
        style={recycleScreenStyles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderMaterialSelection()}
        {renderCameraSection()}
        {renderAddressSection()}
        {renderConfirmButton()}
      </ScrollView>
      
      {renderTabBar()}
    </SafeAreaView>
  );
}
