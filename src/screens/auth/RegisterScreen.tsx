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
  Animated,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import logo from '../../../assets/Logo_recicla.png';
import { 
  validateEmail, 
  validatePhone, 
  validateCPF, 
  validatePassword, 
  validateFullName, 
  validateAddress,
  formatCPF,
  formatPhone
} from '../../../utils/validation';
import { registerScreenStyles } from '../../../src/styles/auth/RegisterScreenStyles';

interface RegisterScreenProps {
  navigation: any;
  route?: {
    params?: {
      userType?: string;
    };
  };
}

export default function RegisterScreen({ navigation, route }: RegisterScreenProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [glowAnim] = useState(new Animated.Value(0));
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Validação do nome completo
    if (!fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    } else if (!validateFullName(fullName)) {
      newErrors.fullName = 'Digite o nome completo (nome e sobrenome)';
    }

    // Validação do email
    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Digite um e-mail válido';
    }

    // Validação do telefone
    if (!phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Digite um telefone válido com DDD';
    }

    // Validação do CPF
    if (!cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(cpf)) {
      newErrors.cpf = 'Digite um CPF válido';
    }

    // Validação do endereço
    if (!address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    } else if (!validateAddress(address)) {
      newErrors.address = 'Digite um endereço completo';
    }

    // Validação da senha
    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message;
      }
    }

    // Validação da confirmação de senha
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validateForm()) {
      Alert.alert(
        'Campos Obrigatórios',
        'Por favor, preencha todos os campos obrigatórios corretamente.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Animação de brilho ao clicar
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    Alert.alert(
      'Cadastro Realizado!',
      'Seu cadastro foi realizado com sucesso. Bem-vindo ao ReciclaMais!',
      [{ text: 'OK', onPress: () => navigation.navigate('Dashboard') }]
    );
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={registerScreenStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      {/* Background Pattern */}
      <View style={registerScreenStyles.backgroundPattern} />
      
      <ScrollView 
        contentContainerStyle={registerScreenStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={registerScreenStyles.logoContainer}>
          <View style={registerScreenStyles.logoGlow}>
            <Image source={logo} style={registerScreenStyles.logo} />
          </View>
          <Text style={registerScreenStyles.subtitle}>Join the future of recycling</Text>
        </View>

        {/* Input Fields */}
        <View style={registerScreenStyles.inputContainer}>
          <View style={registerScreenStyles.inputWrapper}>
            <Ionicons name="person" size={20} color="#00D1FF" style={registerScreenStyles.inputIcon} />
            <TextInput
              style={registerScreenStyles.input}
              placeholder="Nome completo *"
              placeholderTextColor="#666"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
          {errors.fullName && <Text style={registerScreenStyles.errorText}>{errors.fullName}</Text>}
          
          <View style={registerScreenStyles.inputWrapper}>
            <Ionicons name="mail" size={20} color="#00D1FF" style={registerScreenStyles.inputIcon} />
            <TextInput
              style={registerScreenStyles.input}
              placeholder="E-mail *"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.email && <Text style={registerScreenStyles.errorText}>{errors.email}</Text>}

          <View style={registerScreenStyles.inputWrapper}>
            <Ionicons name="call" size={20} color="#00D1FF" style={registerScreenStyles.inputIcon} />
            <TextInput
              style={registerScreenStyles.input}
              placeholder="Telefone com DDD *"
              placeholderTextColor="#666"
              value={phone}
              onChangeText={(text) => setPhone(formatPhone(text))}
              keyboardType="phone-pad"
              autoCorrect={false}
            />
          </View>
          {errors.phone && <Text style={registerScreenStyles.errorText}>{errors.phone}</Text>}

          <View style={registerScreenStyles.inputWrapper}>
            <Ionicons name="card" size={20} color="#00D1FF" style={registerScreenStyles.inputIcon} />
            <TextInput
              style={registerScreenStyles.input}
              placeholder="CPF *"
              placeholderTextColor="#666"
              value={cpf}
              onChangeText={(text) => setCpf(formatCPF(text))}
              keyboardType="numeric"
              autoCorrect={false}
            />
          </View>
          {errors.cpf && <Text style={registerScreenStyles.errorText}>{errors.cpf}</Text>}

          <View style={registerScreenStyles.inputWrapper}>
            <Ionicons name="location" size={20} color="#00D1FF" style={registerScreenStyles.inputIcon} />
            <TextInput
              style={[registerScreenStyles.input, registerScreenStyles.addressInput]}
              placeholder="Endereço completo (rua, número, bairro, cidade, estado) *"
              placeholderTextColor="#666"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
          {errors.address && <Text style={registerScreenStyles.errorText}>{errors.address}</Text>}
          
          <View style={registerScreenStyles.inputWrapper}>
            <Ionicons name="lock-closed" size={20} color="#00D1FF" style={registerScreenStyles.inputIcon} />
            <TextInput
              style={registerScreenStyles.input}
              placeholder="Senha *"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.password && <Text style={registerScreenStyles.errorText}>{errors.password}</Text>}
          
          <View style={registerScreenStyles.inputWrapper}>
            <Ionicons name="lock-closed" size={20} color="#00D1FF" style={registerScreenStyles.inputIcon} />
            <TextInput
              style={registerScreenStyles.input}
              placeholder="Confirmar senha *"
              placeholderTextColor="#666"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.confirmPassword && <Text style={registerScreenStyles.errorText}>{errors.confirmPassword}</Text>}
        </View>

        {/* Register Button */}
        <Animated.View style={[
          registerScreenStyles.buttonContainer,
          {
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          }
        ]}>
          <TouchableOpacity style={registerScreenStyles.registerButton} onPress={handleRegister}>
            <LinearGradient
              colors={['#00FF84', '#00E676']}
              style={registerScreenStyles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={registerScreenStyles.registerButtonText}>CADASTRAR</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Login Link */}
        <TouchableOpacity style={registerScreenStyles.loginContainer} onPress={handleLogin}>
          <Text style={registerScreenStyles.loginText}>Já possui conta? Entrar</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={registerScreenStyles.footer}>
          <Text style={registerScreenStyles.footerText}>
            By clicking sign up, you agree to our{' '}
            <Text style={registerScreenStyles.footerLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={registerScreenStyles.footerLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
