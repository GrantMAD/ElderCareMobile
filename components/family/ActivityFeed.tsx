import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../constants/colors'
import type { ActivityItem } from '../../types/app'

interface ActivityFeedProps {
  items: ActivityItem[]
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
}

export function ActivityFeed({ items, loading, hasMore, onLoadMore }: ActivityFeedProps) {
  if (loading) {
    return <Text style={styles.empty}>Loading activity…</Text>
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No recent activity yet.</Text>}
      ListFooterComponent={
        hasMore ? (
          <Text style={styles.more} onPress={onLoadMore}>
            Load more
          </Text>
        ) : null
      }
    />
  )
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  description: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  timestamp: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  empty: {
    color: Colors.textSecondary,
    paddingVertical: 12,
  },
  more: {
    color: Colors.primary,
    fontWeight: '700',
    paddingVertical: 12,
    textAlign: 'center',
  },
})
