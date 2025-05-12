import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#201E1F',
  },
  topContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  title: {
    color: '#E8C778',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    paddingBottom: 12,
    marginBottom: 12,
    padding: 70,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#B38844',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  link: {
    color: '#d69e1b',
    textDecorationLine: 'underline',
  },
  imagem: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 300,
    borderWidth: 3,
    borderColor: '#E8C778',
  },
});
