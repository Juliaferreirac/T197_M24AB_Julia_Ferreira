import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userText: {
    color: '#fff',
    fontSize: 23,
    fontWeight: 'bold',
  },
  logoutText: {
    color: '#f1c40f',
    fontSize: 18,
  },
  filtros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 5,
  },
  card: {
    backgroundColor: '#2c2c2c',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardText: {
    color: '#fff',
    marginBottom: 4,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#000',
    fontWeight: 'bold',
  },
  downloadButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  downloadText: {
    color: '#fff',
  },
  uploadBtn: {
    backgroundColor: '#f1c40f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  uploadText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },
  fixedButtonContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    backgroundColor: '#121212',
  },
});

export default styles;