import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { Colors } from '../constants/colors'

/**
 * Splash / redirect screen — shown briefly while the root layout checks the
 * session and determines which tab group to send the user to.
 */
export default function Index() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
})
