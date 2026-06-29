import React from 'react';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Bell } from 'lucide-react-native';

export default function ActivityScreen() {
  return (
    <View
      style={{
        flex: 1,
        gap: 16,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Icon name={Bell} size={48} color='#ec4899' />
      <Text variant='heading' style={{ textAlign: 'center', marginTop: 12 }}>
        Recent Activity
      </Text>
      <Text variant='body' style={{ textAlign: 'center', opacity: 0.7, maxWidth: '80%' }}>
        Track your updates, notifications, likes, bookmarks, and comments in one place.
      </Text>
      <Card style={{ width: '100%', marginTop: 20 }}>
        <Text variant='caption' style={{ textAlign: 'center' }}>
          No new notifications yet.
        </Text>
      </Card>
    </View>
  );
}
