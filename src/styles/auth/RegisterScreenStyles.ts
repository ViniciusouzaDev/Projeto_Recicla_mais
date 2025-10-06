import { StyleSheet } from 'react-native';

export const registerScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A0A0A',
    opacity: 0.1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  logoGlow: {
    shadowColor: '#00FF84',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    height: 230,
    width: 220,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00FF84',
    marginTop: 20,
    textShadowColor: '#00FF84',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#00D1FF',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00D1FF',
    marginBottom: 15,
    paddingHorizontal: 15,
    shadowColor: '#00D1FF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#fff',
  },
  buttonContainer: {
    marginBottom: 30,
    shadowColor: '#00FF84',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 10,
  },
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loginContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  loginText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00D1FF',
    textShadowColor: '#00D1FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  footerLink: {
    color: '#00D1FF',
    fontWeight: '500',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 15,
  },
  addressInput: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
});
