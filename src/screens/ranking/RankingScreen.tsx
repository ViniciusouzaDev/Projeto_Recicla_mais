import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { rankingScreenStyles } from '../../../src/styles/ranking/RankingScreenStyles';
import ProfileHeader from '../../components/ProfileHeader';

interface User {
  id: number;
  name: string;
  points: number;
  avatar: string;
  level: string;
}

interface RankingScreenProps {
  navigation: any;
}

export default function RankingScreen({ navigation }: RankingScreenProps) {
  const [activeTab, setActiveTab] = useState('Trophies');
  const [confettiAnimation] = useState(new Animated.Value(0));

  const users: User[] = [
    { id: 1, name: 'Ana Silva', points: 1250, avatar: '👑', level: 'Eco Master' },
    { id: 2, name: 'Carlos Santos', points: 980, avatar: '🛡️', level: 'Green Warrior' },
    { id: 3, name: 'Maria Costa', points: 850, avatar: '🌱', level: 'Nature Lover' },
    { id: 4, name: 'João Oliveira', points: 720, avatar: '♻️', level: 'Recycle Pro' },
    { id: 5, name: 'Fernanda Lima', points: 680, avatar: '🌍', level: 'Planet Saver' },
    { id: 6, name: 'Pedro Rocha', points: 590, avatar: '🌿', level: 'Eco Fighter' },
    { id: 7, name: 'Lucia Ferreira', points: 520, avatar: '🍃', level: 'Green Hero' },
    { id: 8, name: 'Rafael Souza', points: 480, avatar: '🌳', level: 'Tree Hugger' },
    { id: 9, name: 'Camila Dias', points: 420, avatar: '🌺', level: 'Flower Power' },
    { id: 10, name: 'Bruno Alves', points: 380, avatar: '🦋', level: 'Butterfly' },
  ];

  const tabs = [
    { id: 'Home', icon: 'home', label: 'Home' },
    { id: 'Trophies', icon: 'trophy', label: 'Troféus' },
    { id: 'Recycle', icon: 'leaf', label: 'Reciclar' },
    { id: 'Collections', icon: 'list', label: 'Coletas' },
    { id: 'Collector', icon: 'car', label: 'Coletador' },
  ];

  useEffect(() => {
    // Animação de confete para o 1º lugar
    const confettiLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(confettiAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(confettiAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    confettiLoop.start();

    return () => confettiLoop.stop();
  }, []);

  const getRankingColor = (position: number) => {
    switch (position) {
      case 1:
        return '#FFD600'; // Dourado neon
      case 2:
        return '#00D1FF'; // Azul neon
      case 3:
        return '#FF6B00'; // Laranja neon
      default:
        return '#00FF84'; // Verde neon
    }
  };

  const getRankingIcon = (position: number) => {
    switch (position) {
      case 1:
        return '🏆';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '🏅';
    }
  };

  const getProgressBarColor = (points: number) => {
    if (points >= 1000) return '#4CAF50';
    if (points >= 800) return '#8BC34A';
    if (points >= 600) return '#FFC107';
    if (points >= 400) return '#FF9800';
    return '#FF5722';
  };

  const getProgressPercentage = (points: number) => {
    const maxPoints = Math.max(...users.map(u => u.points));
    return (points / maxPoints) * 100;
  };

  const renderHeader = () => (
    <View style={rankingScreenStyles.header}>
      <TouchableOpacity style={rankingScreenStyles.menuButton}>
        <Ionicons name="menu" size={24} color="#333" />
      </TouchableOpacity>
      
      <View style={rankingScreenStyles.titleContainer}>
        <Text style={rankingScreenStyles.title}>Ranking de Recicladores</Text>
        <Text style={rankingScreenStyles.trophyIcon}>🏆</Text>
      </View>
      
      <ProfileHeader 
        navigation={navigation} 
        userType="user" 
        userName="João Silva" 
        userEmail="joao.silva@email.com" 
      />
    </View>
  );

  const renderTopThree = () => (
    <View style={rankingScreenStyles.topThreeContainer}>
      {users.slice(0, 3).map((user, index) => {
        const position = index + 1;
        const isFirst = position === 1;
        
        return (
          <View key={user.id} style={rankingScreenStyles.topThreeItem}>
            {isFirst && (
              <Animated.View
                style={[
                  rankingScreenStyles.confetti,
                  {
                    opacity: confettiAnimation,
                    transform: [
                      {
                        rotate: confettiAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={rankingScreenStyles.confettiText}>✨</Text>
              </Animated.View>
            )}
            
            <LinearGradient
              colors={isFirst ? ['#FFD700', '#FFA000'] : 
                     position === 2 ? ['#C0C0C0', '#9E9E9E'] : 
                     ['#CD7F32', '#8D4E00']}
              style={rankingScreenStyles.topThreeCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={rankingScreenStyles.rankBadge}>
                <Text style={rankingScreenStyles.rankNumber}>{position}º</Text>
                <Text style={rankingScreenStyles.rankIcon}>{getRankingIcon(position)}</Text>
              </View>
              
              <View style={rankingScreenStyles.userInfo}>
                <Text style={rankingScreenStyles.avatarText}>{user.avatar}</Text>
                <Text style={rankingScreenStyles.userName}>{user.name}</Text>
                <Text style={rankingScreenStyles.userLevel}>{user.level}</Text>
                <Text style={rankingScreenStyles.userPoints}>{user.points} pts</Text>
              </View>
              
              <View style={rankingScreenStyles.progressContainer}>
                <View style={rankingScreenStyles.progressBar}>
                  <View 
                    style={[
                      rankingScreenStyles.progressFill,
                      {
                        width: `${getProgressPercentage(user.points)}%`,
                        backgroundColor: getProgressBarColor(user.points),
                      }
                    ]}
                  />
                </View>
              </View>
            </LinearGradient>
          </View>
        );
      })}
    </View>
  );

  const renderOtherUsers = () => (
    <View style={rankingScreenStyles.otherUsersContainer}>
      <Text style={rankingScreenStyles.otherUsersTitle}>Outros Recicladores</Text>
      {users.slice(3).map((user, index) => {
        const position = index + 4;
        
        return (
          <View key={user.id} style={rankingScreenStyles.userCard}>
            <View style={rankingScreenStyles.userCardLeft}>
              <View style={rankingScreenStyles.rankBadgeSmall}>
                <Text style={rankingScreenStyles.rankNumberSmall}>{position}º</Text>
              </View>
              <Text style={rankingScreenStyles.avatarTextSmall}>{user.avatar}</Text>
              <View style={rankingScreenStyles.userInfoSmall}>
                <Text style={rankingScreenStyles.userNameSmall}>{user.name}</Text>
                <Text style={rankingScreenStyles.userLevelSmall}>{user.level}</Text>
              </View>
            </View>
            
            <View style={rankingScreenStyles.userCardRight}>
              <Text style={rankingScreenStyles.userPointsSmall}>{user.points} pts</Text>
              <View style={rankingScreenStyles.progressBarSmall}>
                <View 
                  style={[
                    rankingScreenStyles.progressFillSmall,
                    {
                      width: `${getProgressPercentage(user.points)}%`,
                      backgroundColor: getProgressBarColor(user.points),
                    }
                  ]}
                />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderTabBar = () => (
    <View style={rankingScreenStyles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            rankingScreenStyles.tab,
            activeTab === tab.id && rankingScreenStyles.activeTab
          ]}
          onPress={() => {
            setActiveTab(tab.id);
            if (tab.id === 'Home') {
              navigation.navigate('Dashboard');
            } else if (tab.id === 'Recycle') {
              navigation.navigate('Recycle');
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
            rankingScreenStyles.tabLabel,
            activeTab === tab.id && rankingScreenStyles.activeTabLabel
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={rankingScreenStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      {/* Background Pattern */}
      <View style={rankingScreenStyles.backgroundPattern} />
      
      {renderHeader()}
      
      <ScrollView 
        style={rankingScreenStyles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderTopThree()}
        {renderOtherUsers()}
      </ScrollView>
      
      {renderTabBar()}
    </SafeAreaView>
  );
}
