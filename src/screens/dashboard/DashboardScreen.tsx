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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import logo from '../../../assets/Logo_recicla.png';
import { dashboardScreenStyles } from '../../../src/styles/dashboard/DashboardScreenStyles';
import ProfileHeader from '../../components/ProfileHeader';

interface DashboardScreenProps {
  navigation: any;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const [activeTab, setActiveTab] = useState('Home');
  const [userScore] = useState(450);
  const [monthlyProgress] = useState(10);
  const [glowAnim] = useState(new Animated.Value(0));
  const [scoreAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animação de entrada do score
    Animated.timing(scoreAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const achievements = [
    { id: 1, name: 'Primeira Reciclagem', icon: '🏆', color: '#FFD700' },
    { id: 2, name: 'Eco Warrior', icon: '🛡️', color: '#32CD32' },
    { id: 3, name: 'Green Master', icon: '🌱', color: '#00CED1' },
    { id: 4, name: 'Recycle King', icon: '👑', color: '#FF6347' },
  ];

  const chartData = [
    { week: 'Sem 1', points: 100 },
    { week: 'Sem 2', points: 150 },
    { week: 'Sem 3', points: 200 },
    { week: 'Sem 4', points: 300 },
    { week: 'Esta Semana', points: 450 },
  ];

  const tabs = [
    { id: 'Home', icon: 'home', label: 'Home' },
    { id: 'Trophies', icon: 'trophy', label: 'Troféus' },
    { id: 'Recycle', icon: 'leaf', label: 'Reciclar' },
    { id: 'Rewards', icon: 'gift', label: 'Recompensas' },
  ];

  const renderHeader = () => (
    <View style={dashboardScreenStyles.header}>
      <TouchableOpacity style={dashboardScreenStyles.menuButton}>
        <Ionicons name="menu" size={24} color="#333" />
      </TouchableOpacity>
      
      <View style={dashboardScreenStyles.logoContainer}>
        <Image source={logo} style={dashboardScreenStyles.logo} />
        <Text style={dashboardScreenStyles.appName}>Recicla+</Text>
      </View>
      
      <ProfileHeader 
        navigation={navigation} 
        userType="user" 
        userName="João Silva" 
        userEmail="joao.silva@email.com" 
      />
    </View>
  );

  const renderScoreCard = () => (
    <Animated.View style={[
      dashboardScreenStyles.scoreCard,
      {
        opacity: scoreAnim,
        transform: [{
          scale: scoreAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          })
        }]
      }
    ]}>
      <LinearGradient
        colors={['#00FF84', '#00E676', '#00C853']}
        style={dashboardScreenStyles.scoreGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={dashboardScreenStyles.scoreContent}>
          <View style={dashboardScreenStyles.scoreLeft}>
            <Text style={dashboardScreenStyles.scoreLabel}>Sua Pontuação</Text>
            <Animated.Text style={[
              dashboardScreenStyles.scoreValue,
              {
                opacity: scoreAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                })
              }
            ]}>
              {userScore} pts
            </Animated.Text>
            <Text style={dashboardScreenStyles.scoreSubtext}>+{monthlyProgress}% este mês</Text>
          </View>
          <View style={dashboardScreenStyles.scoreRight}>
            <Ionicons name="trophy" size={40} color="#FFD600" />
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderChart = () => (
    <View style={dashboardScreenStyles.chartContainer}>
      <Text style={dashboardScreenStyles.chartTitle}>Evolução da Pontuação</Text>
      <View style={dashboardScreenStyles.chart}>
        {chartData.map((item, index) => (
          <View key={index} style={dashboardScreenStyles.chartBar}>
            <View 
              style={[
                dashboardScreenStyles.bar, 
                { 
                  height: (item.points / 500) * 100,
                  backgroundColor: index === chartData.length - 1 ? '#00FF84' : '#00D1FF',
                  shadowColor: index === chartData.length - 1 ? '#00FF84' : '#00D1FF',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 8,
                  elevation: 5,
                }
              ]} 
            />
            <Text style={dashboardScreenStyles.barLabel}>{item.week}</Text>
            <Text style={dashboardScreenStyles.barValue}>{item.points}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={dashboardScreenStyles.achievementsContainer}>
      <Text style={dashboardScreenStyles.achievementsTitle}>Conquistas</Text>
      <View style={dashboardScreenStyles.achievementsGrid}>
        {achievements.map((achievement) => (
          <View key={achievement.id} style={[
            dashboardScreenStyles.achievementBadge,
            {
              borderColor: achievement.color,
              shadowColor: achievement.color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }
          ]}>
            <Text style={dashboardScreenStyles.achievementIcon}>{achievement.icon}</Text>
            <Text style={dashboardScreenStyles.achievementName}>{achievement.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderMotivationalText = () => (
    <View style={dashboardScreenStyles.motivationalContainer}>
      <Text style={dashboardScreenStyles.motivationalText}>
        Parabéns! Você reciclou {monthlyProgress}% a mais este mês 🎉
      </Text>
      <Text style={dashboardScreenStyles.motivationalSubtext}>
        Continue assim e desbloqueie novas conquistas!
      </Text>
    </View>
  );

  const renderTabBar = () => (
    <View style={dashboardScreenStyles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            dashboardScreenStyles.tab,
            activeTab === tab.id && dashboardScreenStyles.activeTab
          ]}
          onPress={() => {
            setActiveTab(tab.id);
            if (tab.id === 'Trophies') {
              navigation.navigate('Ranking');
            } else if (tab.id === 'Recycle') {
              navigation.navigate('Recycle');
            } else if (tab.id === 'Rewards') {
              navigation.navigate('Rewards');
            }
          }}
        >
          <Ionicons
            name={tab.icon as any}
            size={24}
            color={activeTab === tab.id ? '#00FF84' : '#666'}
          />
          <Text style={[
            dashboardScreenStyles.tabLabel,
            activeTab === tab.id && dashboardScreenStyles.activeTabLabel
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={dashboardScreenStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      {/* Background Pattern */}
      <View style={dashboardScreenStyles.backgroundPattern} />
      
      {renderHeader()}
      
      <ScrollView 
        style={dashboardScreenStyles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderScoreCard()}
        {renderChart()}
        {renderAchievements()}
        {renderMotivationalText()}
      </ScrollView>
      
      {renderTabBar()}
    </SafeAreaView>
  );
}
