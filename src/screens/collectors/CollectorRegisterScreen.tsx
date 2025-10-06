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
  validateCNPJ,
  validatePassword, 
  validateFullName, 
  validateAddress,
  formatCPF,
  formatCNPJ,
  formatPhone
} from '../../../utils/validation';
import { collectorRegisterScreenStyles } from '../../../src/styles/collectors/CollectorRegisterScreenStyles';

interface CollectorRegisterScreenProps {
  navigation: any;
  route?: {
    params?: {
      userType?: string;
    };
  };
}

export default function CollectorRegisterScreen({ navigation, route }: CollectorRegisterScreenProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [workingArea, setWorkingArea] = useState('');
  const [profileType, setProfileType] = useState('physical'); // 'physical' ou 'legal'
  const [glowAnim] = useState(new Animated.Value(0));
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const vehicleTypes = [
    { id: 'bike', name: 'Bicicleta', icon: '🚲' },
    { id: 'motorcycle', name: 'Moto', icon: '🏍️' },
    { id: 'car', name: 'Carro', icon: '🚗' },
    { id: 'truck', name: 'Caminhão', icon: '🚛' }
  ];

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

    // Validação do CPF (obrigatório para pessoa física)
    if (profileType === 'physical') {
      if (!cpf.trim()) {
        newErrors.cpf = 'CPF é obrigatório';
      } else if (!validateCPF(cpf)) {
        newErrors.cpf = 'Digite um CPF válido';
      }
    }

    // Validação do CNPJ (obrigatório para pessoa jurídica)
    if (profileType === 'legal') {
      if (!cnpj.trim()) {
        newErrors.cnpj = 'CNPJ é obrigatório';
      } else if (!validateCNPJ(cnpj)) {
        newErrors.cnpj = 'Digite um CNPJ válido';
      }
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

    // Validação do tipo de veículo
    if (!vehicleType.trim()) {
      newErrors.vehicleType = 'Tipo de veículo é obrigatório';
    }

    // Validação da placa
    if (!licensePlate.trim()) {
      newErrors.licensePlate = 'Placa do veículo é obrigatória';
    }

    // Validação da área de trabalho
    if (!workingArea.trim()) {
      newErrors.workingArea = 'Área de trabalho é obrigatória';
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
      'Seu cadastro como coletador foi realizado com sucesso. Bem-vindo ao ReciclaMais!',
      [{ text: 'OK', onPress: () => navigation.navigate('Collector') }]
    );
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleBack = () => {
    navigation.navigate('UserType');
  };

  const renderVehicleTypeSelector = () => (
    <View style={collectorRegisterScreenStyles.vehicleTypeContainer}>
      <Text style={collectorRegisterScreenStyles.sectionLabel}>Tipo de Veículo</Text>
      <View style={collectorRegisterScreenStyles.vehicleTypesGrid}>
        {vehicleTypes.map((vehicle) => (
          <TouchableOpacity
            key={vehicle.id}
            style={[
              collectorRegisterScreenStyles.vehicleTypeCard,
              vehicleType === vehicle.id && collectorRegisterScreenStyles.selectedVehicleType
            ]}
            onPress={() => setVehicleType(vehicle.id)}
          >
            <Text style={collectorRegisterScreenStyles.vehicleIcon}>{vehicle.icon}</Text>
            <Text style={[
              collectorRegisterScreenStyles.vehicleName,
              vehicleType === vehicle.id && collectorRegisterScreenStyles.selectedVehicleName
            ]}>
              {vehicle.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={collectorRegisterScreenStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      {/* Background Pattern */}
      <View style={collectorRegisterScreenStyles.backgroundPattern} />
      
      <ScrollView 
        contentContainerStyle={collectorRegisterScreenStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={collectorRegisterScreenStyles.header}>
          <TouchableOpacity style={collectorRegisterScreenStyles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#00D1FF" />
          </TouchableOpacity>
          <Text style={collectorRegisterScreenStyles.headerTitle}>Cadastro de Coletador</Text>
          <View style={collectorRegisterScreenStyles.placeholder} />
        </View>

        {/* Logo Section */}
        <View style={collectorRegisterScreenStyles.logoContainer}>
          <View style={collectorRegisterScreenStyles.logoGlow}>
            <Image source={logo} style={collectorRegisterScreenStyles.logo} />
          </View>
          <Text style={collectorRegisterScreenStyles.subtitle}>Junte-se à nossa rede de coletores</Text>
        </View>

        {/* Input Fields */}
        <View style={collectorRegisterScreenStyles.inputContainer}>
          {/* Tipo de Perfil */}
          <Text style={collectorRegisterScreenStyles.sectionTitle}>Tipo de Perfil</Text>
          <View style={collectorRegisterScreenStyles.profileTypeContainer}>
            <TouchableOpacity
              style={[
                collectorRegisterScreenStyles.profileTypeCard,
                profileType === 'physical' && collectorRegisterScreenStyles.selectedProfileType
              ]}
              onPress={() => setProfileType('physical')}
            >
              <Text style={collectorRegisterScreenStyles.profileTypeText}>Pessoa Física</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                collectorRegisterScreenStyles.profileTypeCard,
                profileType === 'legal' && collectorRegisterScreenStyles.selectedProfileType
              ]}
              onPress={() => setProfileType('legal')}
            >
              <Text style={collectorRegisterScreenStyles.profileTypeText}>Pessoa Jurídica</Text>
            </TouchableOpacity>
          </View>

          {/* Informações Pessoais */}
          <Text style={collectorRegisterScreenStyles.sectionTitle}>Informações Pessoais</Text>
          
          <View style={collectorRegisterScreenStyles.inputWrapper}>
            <Ionicons name="person" size={20} color="#00D1FF" style={collectorRegisterScreenStyles.inputIcon} />
            <TextInput
              style={collectorRegisterScreenStyles.input}
              placeholder="Nome completo *"
              placeholderTextColor="#666"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
          {errors.fullName && <Text style={collectorRegisterScreenStyles.errorText}>{errors.fullName}</Text>}
          
          <View style={collectorRegisterScreenStyles.inputWrapper}>
            <Ionicons name="mail" size={20} color="#00D1FF" style={collectorRegisterScreenStyles.inputIcon} />
            <TextInput
              style={collectorRegisterScreenStyles.input}
              placeholder="E-mail *"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.email && <Text style={collectorRegisterScreenStyles.errorText}>{errors.email}</Text>}

          <View style={collectorRegisterScreenStyles.inputWrapper}>
            <Ionicons name="call" size={20} color="#00D1FF" style={collectorRegisterScreenStyles.inputIcon} />
            <TextInput
              style={collectorRegisterScreenStyles.input}
              placeholder="Telefone com DDD *"
              placeholderTextColor="#666"
              value={phone}
              onChangeText={(text) => setPhone(formatPhone(text))}
              keyboardType="phone-pad"
              autoCorrect={false}
            />
          </View>
          {errors.phone && <Text style={collectorRegisterScreenStyles.errorText}>{errors.phone}</Text>}

          {profileType === 'physical' && (
            <View style={collectorRegisterScreenStyles.inputWrapper}>
              <Ionicons name="card" size={20} color="#00D1FF" style={collectorRegisterScreenStyles.inputIcon} />
              <TextInput
                style={collectorRegisterScreenStyles.input}
                placeholder="CPF *"
                placeholderTextColor="#666"
                value={cpf}
                onChangeText={(text) => setCpf(formatCPF(text))}
                keyboardType="numeric"
                autoCorrect={false}
              />
            </View>
          )}
          {errors.cpf && <Text style={collectorRegisterScreenStyles.errorText}>{errors.cpf}</Text>}

          {profileType === 'legal' && (
            <View style={collectorRegisterScreenStyles.inputWrapper}>
              <Ionicons name="business" size={20} color="#00D1FF" style={collectorRegisterScreenStyles.inputIcon} />
              <TextInput
                style={collectorRegisterScreenStyles.input}
                placeholder="CNPJ *"
                placeholderTextColor="#666"
                value={cnpj}
                onChangeText={(text) => setCnpj(formatCNPJ(text))}
                keyboardType="numeric"
                autoCorrect={false}
              />
            </View>
          )}
          {errors.cnpj && <Text style={collectorRegisterScreenStyles.errorText}>{errors.cnpj}</Text>}

          <View style={collectorRegisterScreenStyles.inputWrapper}>
            <Ionicons name="location" size={20} color="#00D1FF" style={collectorRegisterScreenStyles.inputIcon} />
            <TextInput
              style={[collectorRegisterScreenStyles.input, collectorRegisterScreenStyles.addressInput]}
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
          {errors.address && <Text style={collectorRegisterScreenStyles.errorText}>{errors.address}</Text>}
          
          <View style={collectorRegisterScreenStyles.inputWrapper}>
            <Ionicons name="lock-closed" size={20} color="#00D1FF" style={collectorRegisterScreenStyles.inputIcon} />
            <TextInput
              style={collectorRegisterScreenStyles.input}
              placeholder="Senha *"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.password && <Text style={collectorRegisterScreenStyles.errorText}>{errors.password}</Text>}
          
          <View style={collectorRegisterScreenStyles.inputWrapper}>
            <Ionicons name="lock-closed" size={20} color="#00D1FF" style={collectorRegisterScreenStyles.inputIcon} />
            <TextInput
              style={collectorRegisterScreenStyles.input}
              placeholder="Confirmar senha *"
              placeholderTextColor="#666"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.confirmPassword && <Text style={collectorRegisterScreenStyles.errorText}>{errors.confirmPassword}</Text>}

          {/* Informações do Veículo */}
          <Text style={collectorRegisterScreenStyles.sectionTitle}>Informações do Veículo</Text>
          
          {renderVehicleTypeSelector()}
          {errors.vehicleType && <Text style={collectorRegisterScreenStyles.errorText}>{errors.vehicleType}</Text>}

          <View style={collectorRegisterScreenStyles.inputWrapper}>
            <Ionicons name="car" size={20} color="#00D1FF" style={collectorRegisterScreenStyles.inputIcon} />
            <TextInput
              style={collectorRegisterScreenStyles.input}
              placeholder="Placa do veículo *"
              placeholderTextColor="#666"
              value={licensePlate}
              onChangeText={setLicensePlate}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>
          {errors.licensePlate && <Text style={collectorRegisterScreenStyles.errorText}>{errors.licensePlate}</Text>}

          <View style={collectorRegisterScreenStyles.inputWrapper}>
            <Ionicons name="location" size={20} color="#00D1FF" style={collectorRegisterScreenStyles.inputIcon} />
            <TextInput
              style={collectorRegisterScreenStyles.input}
              placeholder="Área de trabalho (bairros, regiões) *"
              placeholderTextColor="#666"
              value={workingArea}
              onChangeText={setWorkingArea}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
          {errors.workingArea && <Text style={collectorRegisterScreenStyles.errorText}>{errors.workingArea}</Text>}
        </View>

        {/* Register Button */}
        <Animated.View style={[
          collectorRegisterScreenStyles.buttonContainer,
          {
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          }
        ]}>
          <TouchableOpacity style={collectorRegisterScreenStyles.registerButton} onPress={handleRegister}>
            <LinearGradient
              colors={['#00D1FF', '#0099CC']}
              style={collectorRegisterScreenStyles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={collectorRegisterScreenStyles.registerButtonText}>CADASTRAR COMO COLETADOR</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Login Link */}
        <TouchableOpacity style={collectorRegisterScreenStyles.loginContainer} onPress={handleLogin}>
          <Text style={collectorRegisterScreenStyles.loginText}>Já possui conta? Entrar</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={collectorRegisterScreenStyles.footer}>
          <Text style={collectorRegisterScreenStyles.footerText}>
            Ao se cadastrar como coletador, você concorda com nossos{' '}
            <Text style={collectorRegisterScreenStyles.footerLink}>Termos de Serviço</Text>
            {' '}e{' '}
            <Text style={collectorRegisterScreenStyles.footerLink}>Política de Privacidade</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
