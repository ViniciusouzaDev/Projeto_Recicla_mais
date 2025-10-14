import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Modal,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import logo from '../../../assets/Logo_recicla.png';
import { rewardsScreenStyles } from '../../../src/styles/rewards/RewardsScreenStyles';
import ProfileHeader from '../../components/ProfileHeader';

const { width } = Dimensions.get('window');

interface RewardsScreenProps {
  navigation: any;
}

interface RewardItem {
  id: number;
  title: string;
  description: string;
  points: number;
  icon: string;
}

export default function RewardsScreen({ navigation }: RewardsScreenProps) {
  const [userPoints] = useState(450);
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('Rewards');

  // Animation values for glowing effect
  const glowAnim = React.useRef(new Animated.Value(0.6)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rewards: RewardItem[] = [
    { 
      id: 1, 
      title: 'Recarga de Celular', 
      description: 'Receba R$10 de créditos para seu celular', 
      points: 200, 
      icon: 'phone-portrait' 
    },
    { 
      id: 2, 
      title: 'Desconto em Restaurantes', 
      description: '15% de desconto em restaurantes parceiros', 
      points: 300, 
      icon: 'restaurant' 
    },
    { 
      id: 3, 
      title: 'Desconto em Lojas', 
      description: '10% de desconto em lojas parceiras', 
      points: 250, 
      icon: 'cart' 
    },
    { 
      id: 4, 
      title: 'Ingresso de Cinema', 
      description: 'Um ingresso grátis para qualquer filme', 
      points: 500, 
      icon: 'film' 
    },
    { 
      id: 5, 
      title: 'Assinatura Premium', 
      description: '1 mês de assinatura premium no app', 
      points: 400, 
      icon: 'star' 
    },
  ];

  const handleRewardSelect = (reward: RewardItem) => {
    setSelectedReward(reward);
    setModalVisible(true);
  };

  const handleRedeemReward = () => {
    // Here you would implement the actual redemption logic
    setModalVisible(false);
    // Show success message or update points
  };

  const renderHeader = () => (
    <View style={rewardsScreenStyles.header}>
      <TouchableOpacity 
        style={rewardsScreenStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      
      <View style={rewardsScreenStyles.logoContainer}>
        <Image source={logo} style={rewardsScreenStyles.logo} />
        <Text style={rewardsScreenStyles.appName}>Recicla+</Text>
      </View>
      
      <ProfileHeader 
        navigation={navigation} 
        userType="user" 
        userName="João Silva" 
        userEmail="joao.silva@email.com" 
      />
    </View>
  );

  const renderPointsCard = () => (
    <LinearGradient
      colors={['#4e54c8', '#8f94fb']}
      style={rewardsScreenStyles.pointsCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View 
        style={[
          rewardsScreenStyles.glowOverlay, 
          { opacity: glowAnim }
        ]} 
      />
      <View style={rewardsScreenStyles.pointsContent}>
        <View style={rewardsScreenStyles.pointsLeft}>
          <Text style={rewardsScreenStyles.pointsLabel}>Seus Pontos</Text>
          <Text style={rewardsScreenStyles.pointsValue}>{userPoints}</Text>
        </View>
        <View style={rewardsScreenStyles.pointsRight}>
          <Ionicons name="wallet" size={40} color="#FFD700" />
        </View>
      </View>
    </LinearGradient>
  );

  const renderRewardsList = () => (
    <View style={rewardsScreenStyles.rewardsContainer}>
      <Text style={rewardsScreenStyles.rewardsTitle}>Recompensas Disponíveis</Text>
      {rewards.map((reward) => (
        <TouchableOpacity
          key={reward.id}
          style={[
            rewardsScreenStyles.rewardCard,
            userPoints < reward.points && rewardsScreenStyles.disabledReward
          ]}
          onPress={() => userPoints >= reward.points && handleRewardSelect(reward)}
          disabled={userPoints < reward.points}
        >
          <Animated.View 
            style={[
              rewardsScreenStyles.rewardGlowBorder, 
              { opacity: userPoints >= reward.points ? glowAnim : 0.3 }
            ]} 
          />
          <View style={rewardsScreenStyles.rewardIconContainer}>
            <Ionicons 
              name={reward.icon as any} 
              size={32} 
              color={userPoints >= reward.points ? "#00ffff" : "#666"} 
            />
          </View>
          <View style={rewardsScreenStyles.rewardInfo}>
            <Text style={rewardsScreenStyles.rewardTitle}>{reward.title}</Text>
            <Text style={rewardsScreenStyles.rewardDescription}>{reward.description}</Text>
          </View>
          <View style={rewardsScreenStyles.rewardPoints}>
            <Text style={[
              rewardsScreenStyles.rewardPointsText,
              userPoints < reward.points && rewardsScreenStyles.disabledPointsText
            ]}>
              {reward.points} pts
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderConfirmationModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={rewardsScreenStyles.modalOverlay}>
        <LinearGradient
          colors={['#1a2a6c', '#4e54c8']}
          style={rewardsScreenStyles.modalContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View 
            style={[
              rewardsScreenStyles.modalGlowBorder, 
              { opacity: glowAnim }
            ]} 
          />
          <Text style={rewardsScreenStyles.modalTitle}>Confirmar Resgate</Text>
          
          {selectedReward && (
            <>
              <View style={rewardsScreenStyles.modalRewardInfo}>
                <Ionicons 
                  name={selectedReward.icon as any} 
                  size={48} 
                  color="#00ffff" 
                />
                <Text style={rewardsScreenStyles.modalRewardTitle}>{selectedReward.title}</Text>
                <Text style={rewardsScreenStyles.modalRewardDescription}>
                  {selectedReward.description}
                </Text>
                <Text style={rewardsScreenStyles.modalPointsCost}>
                  Custo: {selectedReward.points} pontos
                </Text>
              </View>
              
              <View style={rewardsScreenStyles.modalActions}>
                <TouchableOpacity 
                  style={rewardsScreenStyles.modalCancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={rewardsScreenStyles.modalCancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={rewardsScreenStyles.modalConfirmButton}
                  onPress={handleRedeemReward}
                >
                  <Text style={rewardsScreenStyles.modalConfirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </LinearGradient>
      </View>
    </Modal>
  );

  const renderTabBar = () => (
    <View style={rewardsScreenStyles.tabBar}>
      {[
        { id: 'Home', icon: 'home', label: 'Home' },
        { id: 'Trophies', icon: 'trophy', label: 'Troféus' },
        { id: 'Recycle', icon: 'leaf', label: 'Reciclar' },
        { id: 'Rewards', icon: 'gift', label: 'Recompensas' },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            rewardsScreenStyles.tab,
            activeTab === tab.id && rewardsScreenStyles.activeTab
          ]}
          onPress={() => {
            setActiveTab(tab.id);
            if (tab.id === 'Home') {
              navigation.navigate('Dashboard');
            } 
            else if (tab.id === 'Recycle') {
              navigation.navigate('Recycle');
            }
            else if (tab.id === 'Trophies') {
              navigation.navigate('Ranking');
            }
          }}
        >
          <Ionicons
            name={tab.icon as any}
            size={24}
            color={activeTab === tab.id ? '#00ffff' : '#999'}
          />
          <Text style={[
            rewardsScreenStyles.tabLabel,
            activeTab === tab.id && rewardsScreenStyles.activeTabLabel
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={rewardsScreenStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {renderHeader()}
      
      <ScrollView 
        style={rewardsScreenStyles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderPointsCard()}
        {renderRewardsList()}
      </ScrollView>
      
      {renderTabBar()}
      {renderConfirmationModal()}
    </SafeAreaView>
  );
}
