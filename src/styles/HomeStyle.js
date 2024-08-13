import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: 'black',
  },
  smsContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  smsText: {
    fontSize: 16,
  },
  noSmsText: {
    fontSize: 16,
    color: '#888',
  },
  stopButton: {
    flexDirection: 'row',
    backgroundColor: '#3D8320',
    padding: 15,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default styles;

