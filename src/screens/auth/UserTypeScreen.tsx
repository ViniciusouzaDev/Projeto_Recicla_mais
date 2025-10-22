import React, { useState } from 'react';
import { 
  StatusBar, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  ScrollView,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import logo from '../../../assets/Logo_recicla.png';
import { userTypeScreenStyles } from '../../../src/styles/auth/UserTypeScreenStyles';

interface UserTypeScreenProps {
  navigation: any;
}

export default function UserTypeScreen({ navigation }: UserTypeScreenProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  const userTypes = [
    {
      id: 'user',
      title: 'Usuário Comum',
      subtitle: 'Quero reciclar e ganhar pontos',
      icon: '♻️',
      color: '#00FF84',
      description: 'Cadastre lixo para coleta e ganhe pontos por reciclagem',
      features: [
        'Cadastrar materiais para coleta',
        'Ganhar pontos por reciclagem',
        'Trocar pontos por recompensas',
        'Acompanhar seu ranking'
      ]
    },
    {
      id: 'company',
      title: 'Empresa Parceira',
      subtitle: 'Quero oferecer benefícios e recompensas',
      icon: '🏢',
      color: '#FFD600',
      description: 'Cadastre sua empresa e ofereça benefícios para usuários',
      features: [
        'Cadastrar dados da empresa',
        'Criar benefícios personalizados',
        'Definir pontos necessários',
        'Acompanhar resgates de benefícios'
      ]
    }
  ];

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    
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

  const handleContinue = () => {
    if (!selectedType) {
      return;
    }

    if (selectedType === 'user') {
      navigation.navigate('Register', { userType: 'user' });
    } else if (selectedType === 'company') {
      navigation.navigate('CompanyAuth', { userType: 'company' });
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const renderUserTypeCard = (type: any) => (
    <Animated.View
      key={type.id}
      style={[
        userTypeScreenStyles.typeCard,
        {
          borderColor: selectedType === type.id ? type.color : 'rgba(0, 209, 255, 0.3)',
          borderWidth: selectedType === type.id ? 3 : 1,
          transform: [{ scale: selectedType === type.id ? scaleAnim : 1 }],
        }
      ]}
    >
      <TouchableOpacity
        style={userTypeScreenStyles.cardContent}
        onPress={() => handleTypeSelect(type.id)}
      >
        {/* Header do Card */}
        <View style={userTypeScreenStyles.cardHeader}>
          <View style={[userTypeScreenStyles.iconContainer, { backgroundColor: type.color }]}>
            <Text style={userTypeScreenStyles.typeIcon}>{type.icon}</Text>
          </View>
          <View style={userTypeScreenStyles.titleContainer}>
            <Text style={userTypeScreenStyles.typeTitle}>{type.title}</Text>
            <Text style={userTypeScreenStyles.typeSubtitle}>{type.subtitle}</Text>
          </View>
        </View>

        {/* Descrição */}
        <Text style={userTypeScreenStyles.typeDescription}>{type.description}</Text>

        {/* Features */}
        <View style={userTypeScreenStyles.featuresContainer}>
          {type.features.map((feature: string, index: number) => (
            <View key={index} style={userTypeScreenStyles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color={type.color} />
              <Text style={userTypeScreenStyles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Badge de Seleção */}
        {selectedType === type.id && (
          <View style={[userTypeScreenStyles.selectedBadge, { backgroundColor: type.color }]}>
            <Ionicons name="checkmark" size={20} color="#000" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={userTypeScreenStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      {/* Background Pattern */}
      <View style={userTypeScreenStyles.backgroundPattern} />
      
      <ScrollView 
        contentContainerStyle={userTypeScreenStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={userTypeScreenStyles.logoContainer}>
          <View style={userTypeScreenStyles.logoGlow}>
            <Image source={logo} style={userTypeScreenStyles.logo} />
          </View>
          <Text style={userTypeScreenStyles.appTitle}>ReciclaMais</Text>
          <Text style={userTypeScreenStyles.subtitle}>Escolha como você quer participar</Text>
        </View>

        {/* User Type Selection */}
        <View style={userTypeScreenStyles.typesContainer}>
          {userTypes.map(renderUserTypeCard)}
        </View>

        {/* Continue Button */}
        {selectedType && (
          <View style={userTypeScreenStyles.buttonContainer}>
            <TouchableOpacity style={userTypeScreenStyles.continueButton} onPress={handleContinue}>
              <LinearGradient
                colors={['#00FF84', '#00E676']}
                style={userTypeScreenStyles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={userTypeScreenStyles.continueButtonText}>CONTINUAR</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Login Link */}
        <TouchableOpacity style={userTypeScreenStyles.loginContainer} onPress={handleLogin}>
          <Text style={userTypeScreenStyles.loginText}>Já possui conta? Entrar</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={userTypeScreenStyles.footer}>
          <Text style={userTypeScreenStyles.footerText}>
            Ao continuar, você concorda com nossos{' '}
            <Text style={userTypeScreenStyles.footerLink}>Termos de Serviço</Text>
            {' '}e{' '}
            <Text style={userTypeScreenStyles.footerLink}>Política de Privacidade</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
