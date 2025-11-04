import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import logo from '../../../assets/Logo_recicla.png';
import { dashboardScreenStyles } from '../../../src/styles/dashboard/DashboardScreenStyles';
import ProfileHeader from '../../components/ProfileHeader';
import ShareButton from '../../components/ShareButton';
import { useTheme } from '../../contexts/ThemeContext';
import { userService } from '../../services/userService';

export default function DashboardScreen({ navigation }: any) {
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState('Home');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userScore, setUserScore] = useState(0);
  const [monthlyProgress, setMonthlyProgress] = useState(0);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [scoreAnim] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    // Animação mesmo se score for 0
    Animated.timing(scoreAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [userScore]);

  const fetchUserData = async () => {
    try {
      const profile = await userService.getProfile();
      const scoreHistory = await userService.getScoreHistory();
      const progress = await userService.getProgress();
      const userAchievements = await userService.getAchievements();
      const history = await userService.getChartData();

      setUserProfile(profile);
      setUserScore(scoreHistory.reduce((acc: number, item: any) => acc + item.pontos, 0));
      setMonthlyProgress(progress.percentual || 0);
      setAchievements(userAchievements);
      setChartData(history);
    } catch (error: any) {
      console.error('Erro ao buscar dados do usuário:', error);
      // Redireciona para login se não autenticado
      if (error.message === 'Usuário não autenticado') {
        navigation.replace('Login');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={dashboardScreenStyles.header}>
      <View style={dashboardScreenStyles.logoContainer}>
        <Image source={logo} style={dashboardScreenStyles.logo} />
        <Text style={dashboardScreenStyles.appName}>Recicla+</Text>
      </View>

      {userProfile && (
        <ProfileHeader
          navigation={navigation}
          userType="user"
          userName={userProfile.nome}
          userEmail={userProfile.email}
        />
      )}
    </View>
  );

  const shareMessage = `Estou contribuindo para um mundo mais sustentável com o Recicla+! Já reciclei vários materiais e ganhei ${userScore} pontos. Junte-se a mim nessa missão! #ReciclaMais #Sustentabilidade`;

  const renderScoreCard = () => (
    <Animated.View
      style={[
        dashboardScreenStyles.scoreCard,
        {
          opacity: scoreAnim,
          transform: [
            {
              scale: scoreAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={['#00FF84', '#00E676', '#00C853']}
        style={dashboardScreenStyles.scoreGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={dashboardScreenStyles.scoreContent}>
          <View style={dashboardScreenStyles.scoreLeft}>
            <Text style={dashboardScreenStyles.scoreLabel}>Sua Pontuação</Text>
            <Animated.Text
              style={[
                dashboardScreenStyles.scoreValue,
                { opacity: scoreAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
              ]}
            >
              {userScore} pts
            </Animated.Text>
            <Text style={dashboardScreenStyles.scoreSubtext}>+{monthlyProgress}% este mês</Text>
          </View>
          <View style={dashboardScreenStyles.scoreRight}>
            <Ionicons name="trophy" size={40} color="#FFD600" />
          </View>
        </View>
        <View style={dashboardScreenStyles.shareButtonContainer}>
          <ShareButton message={shareMessage} title="Compartilhar Progresso" showFacebook showInstagram />
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
                  height: (item.pontos / 500) * 100,
                  backgroundColor: index === chartData.length - 1 ? '#00FF84' : '#00D1FF',
                  shadowColor: index === chartData.length - 1 ? '#00FF84' : '#00D1FF',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 8,
                  elevation: 5,
                },
              ]}
            />
            <Text style={dashboardScreenStyles.barLabel}>{item.semana}</Text>
            <Text style={dashboardScreenStyles.barValue}>{item.pontos}</Text>
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
          <View
            key={achievement.id}
            style={[
              dashboardScreenStyles.achievementBadge,
              {
                borderColor: achievement.color || '#00FF84',
                shadowColor: achievement.color || '#00FF84',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              },
            ]}
          >
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

  const tabs = [
    { id: 'Home', icon: 'home', label: 'Home' },
    { id: 'Trophies', icon: 'trophy', label: 'Troféus' },
    { id: 'Recycle', icon: 'leaf', label: 'Reciclar' },
    { id: 'Collections', icon: 'list', label: 'Coletas' },
    { id: 'Collector', icon: 'car', label: 'Coletador' },
  ];

  const renderTabBar = () => (
    <View style={dashboardScreenStyles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[dashboardScreenStyles.tab, activeTab === tab.id && dashboardScreenStyles.activeTab]}
          onPress={() => {
            setActiveTab(tab.id);
            if (tab.id === 'Trophies') navigation.navigate('Ranking');
            if (tab.id === 'Recycle') navigation.navigate('Recycle');
            if (tab.id === 'Collections') navigation.navigate('CollectionStatus');
            if (tab.id === 'Collector') navigation.navigate('Collector');
          }}
        >
          <Ionicons name={tab.icon as any} size={24} color={activeTab === tab.id ? '#00FF84' : '#666'} />
          <Text style={[dashboardScreenStyles.tabLabel, activeTab === tab.id && dashboardScreenStyles.activeTabLabel]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={dashboardScreenStyles.container}>
        <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#00FF84" />
          <Text style={{ marginTop: 10 }}>Carregando dados...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dashboardScreenStyles.container}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      <View style={dashboardScreenStyles.backgroundPattern} />
      {renderHeader()}
      <ScrollView style={dashboardScreenStyles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {renderScoreCard()}
        {renderChart()}
        {renderAchievements()}
        {renderMotivationalText()}
      </ScrollView>
      {renderTabBar()}
    </SafeAreaView>
  );
}




/*
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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
import ShareButton from '../../components/ShareButton';
import { useTheme } from '../../contexts/ThemeContext';

interface DashboardScreenProps {
  navigation: any;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { theme } = useTheme();

  // Estados do dashboard
  const [activeTab, setActiveTab] = useState('Home');
  const [userScore] = useState(450); // Pontuação do usuário
  const [monthlyProgress] = useState(10); // Progresso mensal
  const [scoreAnim] = useState(new Animated.Value(0)); // Animação do score

  // TODO: Implementar sistema de pontuação real
  // TODO: Conectar com backend para dados do usuário
  // TODO: Implementar notificações push
  // TODO: Adicionar animações mais complexas
  // TODO: Implementar sistema de conquistas dinâmico

  useEffect(() => {
    // Animação de entrada do score
    Animated.timing(scoreAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Conquistas estáticas para demonstração
  const achievements = [
    { id: 1, name: 'Primeira Reciclagem', icon: '🏆', color: '#FFD700' },
    { id: 2, name: 'Eco Warrior', icon: '🛡️', color: '#32CD32' },
    { id: 3, name: 'Green Master', icon: '🌱', color: '#00CED1' },
    { id: 4, name: 'Recycle King', icon: '👑', color: '#FF6347' },
  ];

  // Dados de gráfico estáticos
  const chartData = [
    { week: 'Sem 1', points: 100 },
    { week: 'Sem 2', points: 150 },
    { week: 'Sem 3', points: 200 },
    { week: 'Sem 4', points: 300 },
    { week: 'Esta Semana', points: 450 },
  ];

  // Aba de navegação inferior
  const tabs = [
    { id: 'Home', icon: 'home', label: 'Home' },
    { id: 'Trophies', icon: 'trophy', label: 'Troféus' },
    { id: 'Recycle', icon: 'leaf', label: 'Reciclar' },
    { id: 'Collections', icon: 'list', label: 'Coletas' },
    { id: 'Collector', icon: 'car', label: 'Coletador' },
  ];

  // Render do cabeçalho
  const renderHeader = () => (
    <View style={dashboardScreenStyles.header}>
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

  // Mensagem para compartilhar progresso
  const shareMessage = "Estou contribuindo para um mundo mais sustentável com o Recicla+! Já reciclei vários materiais e ganhei " + userScore + " pontos. Junte-se a mim nessa missão! #ReciclaMais #Sustentabilidade";

  // Cartão de pontuação
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
        <View style={dashboardScreenStyles.shareButtonContainer}>
          <ShareButton 
            message={shareMessage}
            title="Compartilhar Progresso"
            showFacebook={true}
            showInstagram={true}
          />
        </View>
      </LinearGradient>
    </Animated.View>
  );

  // Gráfico de evolução
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

  // Lista de conquistas
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

  // Texto motivacional
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

  // Barra de navegação inferior
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
            // Navegação de acordo com a aba
            if (tab.id === 'Trophies') navigation.navigate('Ranking');
            if (tab.id === 'Recycle') navigation.navigate('Recycle');
            if (tab.id === 'Collections') navigation.navigate('CollectionStatus');
            if (tab.id === 'Collector') navigation.navigate('Collector');
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

  // Render principal
  return (
    <SafeAreaView style={dashboardScreenStyles.container}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
      
      {/* Background Pattern */
   //   <View style={dashboardScreenStyles.backgroundPattern} />
      
    //  {renderHeader()}
      
   //   <ScrollView 
     //   style={dashboardScreenStyles.content}
       // showsVerticalScrollIndicator={false}
     // >
       // {renderScoreCard()}
       // {renderChart()}
       // {renderAchievements()}
       // {renderMotivationalText()}
     // </ScrollView> 
      
     // {renderTabBar()}
  //  </SafeAreaView>
  //);
//}
//*/




















import api from "./Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as jwtDecode from "jwt-decode"; // ✅ Forma compatível com todas as versões

interface DecodedToken {
  usuario_id: number;
  email?: string;
  iat?: number;
  exp?: number;
}

/**
 * Obtém o ID do usuário a partir do token JWT armazenado.
 */
async function getUserIdFromToken(): Promise<number | null> {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ Nenhum token encontrado no AsyncStorage.");
      return null;
    }

    // ✅ Decodificação compatível com qualquer versão de jwt-decode
    const decoded: DecodedToken = (
      (jwtDecode as any).jwtDecode
        ? (jwtDecode as any).jwtDecode(token)
        : (jwtDecode as any).default
        ? (jwtDecode as any).default(token)
        : (jwtDecode as any)(token)
    ) as DecodedToken;

    if (!decoded?.usuario_id) {
      console.warn("⚠️ Token não contém o campo 'usuario_id'.", decoded);
      return null;
    }

    console.log("✅ Token decodificado:", decoded);
    return decoded.usuario_id;
  } catch (error) {
    console.error("❌ Erro ao decodificar token:", error);
    return null;
  }
}

/**
 * Retorna o header de autenticação (Authorization: Bearer token)
 */
async function getAuthHeaders() {
  const token = await AsyncStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Serviços do usuário
 */
export const userService = {
  /**
   * Busca os dados de perfil do usuário autenticado
   */
  async getProfile() {
    try {
      const userId = await getUserIdFromToken();
      if (!userId) throw new Error("Usuário não autenticado");

      const { data } = await api.get(`/usuarios/${userId}`, {
        headers: await getAuthHeaders(),
      });
      return data;
    } catch (error: any) {
      console.error("❌ Erro ao buscar perfil:", error.response?.data || error.message);
      throw new Error("Erro ao buscar perfil do usuário");
    }
  },

  /**
   * Histórico de pontuação do usuário
   */
  async getScoreHistory() {
    try {
      const userId = await getUserIdFromToken();
      if (!userId) throw new Error("Usuário não autenticado");

      const { data } = await api.get(`/pontuacao/usuario/${userId}`, {
        headers: await getAuthHeaders(),
      });
      return data;
    } catch (error: any) {
      console.error("❌ Erro ao buscar histórico de pontuação:", error.response?.data || error.message);
      throw new Error("Erro ao buscar histórico de pontuação");
    }
  },

  /**
   * Progresso do usuário
   */
  async getProgress() {
    try {
      const userId = await getUserIdFromToken();
      if (!userId) throw new Error("Usuário não autenticado");

      const { data } = await api.get(`/usuarios/${userId}/progresso`, {
        headers: await getAuthHeaders(),
      });
      return data;
    } catch (error: any) {
      console.error("❌ Erro ao buscar progresso:", error.response?.data || error.message);
      throw new Error("Erro ao buscar progresso do usuário");
    }
  },

  /**
   * Conquistas do usuário
   */
  async getAchievements() {
    try {
      const userId = await getUserIdFromToken();
      if (!userId) throw new Error("Usuário não autenticado");

      const { data } = await api.get(`/conquistas/${userId}`, {
        headers: await getAuthHeaders(),
      });
      return data;
    } catch (error: any) {
      console.error("❌ Erro ao buscar conquistas:", error.response?.data || error.message);
      throw new Error("Erro ao buscar conquistas do usuário");
    }
  },

  /**
   * Dados de gráfico do histórico do usuário
   */
  async getChartData() {
    try {
      const userId = await getUserIdFromToken();
      if (!userId) throw new Error("Usuário não autenticado");

      const { data } = await api.get(`/usuarios/${userId}/historico`, {
        headers: await getAuthHeaders(),
      });
      return data;
    } catch (error: any) {
      console.error("❌ Erro ao buscar dados de gráfico:", error.response?.data || error.message);
      throw new Error("Erro ao buscar dados de gráfico do usuário");
    }
  },
};
