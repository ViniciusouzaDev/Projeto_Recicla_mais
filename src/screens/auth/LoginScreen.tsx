import React, { useState } from 'react';
import { 
  StatusBar, 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import logo from '../../../assets/Logo_recicla.png';
import { loginScreenStyles } from '../../../src/styles/auth/LoginScreenStyles';

const { width } = Dimensions.get('window');

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [glowAnim] = useState(new Animated.Value(0));

  const handleContinue = () => {
    // Animação de brilho ao clicar
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
    
    setTimeout(() => {
      navigation.navigate('Dashboard');
    }, 300);
  };

  const handleGoogleLogin = () => {
    console.log('Google login pressed');
  };

  const handleCreateAccount = () => {
    navigation.navigate('UserType');
  };

  return (
    <SafeAreaView style={loginScreenStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      {/* Background Pattern */}
      <View style={loginScreenStyles.backgroundPattern} />
      
      <ScrollView 
        contentContainerStyle={loginScreenStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={loginScreenStyles.logoContainer}>
          <View style={loginScreenStyles.logoGlow}>
            <Image source={logo} style={loginScreenStyles.logo} />
          </View>
          <Text style={loginScreenStyles.subtitle}>Log in to start collecting aluminum, paper, plastic and glass</Text>
        </View>

        {/* Input Fields */}
        <View style={loginScreenStyles.inputContainer}>
          <View style={loginScreenStyles.inputWrapper}>
            <Ionicons name="person" size={20} color="#00D1FF" style={loginScreenStyles.inputIcon} />
            <TextInput
              style={loginScreenStyles.input}
              placeholder="Name"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          
          <View style={loginScreenStyles.inputWrapper}>
            <Ionicons name="lock-closed" size={20} color="#00D1FF" style={loginScreenStyles.inputIcon} />
            <TextInput
              style={loginScreenStyles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Continue Button */}
        <Animated.View style={[
          loginScreenStyles.buttonContainer,
          {
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          }
        ]}>
          <TouchableOpacity style={loginScreenStyles.continueButton} onPress={handleContinue}>
            <LinearGradient
              colors={['#00FF84', '#00E676']}
              style={loginScreenStyles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={loginScreenStyles.continueButtonText}>LOG IN</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Divider */}
        <View style={loginScreenStyles.dividerContainer}>
          <View style={loginScreenStyles.dividerLine} />
          <Text style={loginScreenStyles.dividerText}>or</Text>
          <View style={loginScreenStyles.dividerLine} />
        </View>

        {/* Social Login Buttons */}
        <View style={loginScreenStyles.socialButtonsContainer}>
          <TouchableOpacity style={loginScreenStyles.socialButton} onPress={handleGoogleLogin}>
            <Ionicons name="logo-google" size={20} color="#FFD600" />
            <Text style={loginScreenStyles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* Create Account Link */}
        <TouchableOpacity style={loginScreenStyles.createAccountContainer} onPress={handleCreateAccount}>
          <Text style={loginScreenStyles.createAccountText}>Criar uma conta</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={loginScreenStyles.footer}>
          <Text style={loginScreenStyles.footerText}>
            By clicking continue, you agree to our{' '}
            <Text style={loginScreenStyles.footerLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={loginScreenStyles.footerLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
