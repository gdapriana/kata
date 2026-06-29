import React from 'react';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { User } from 'lucide-react-native';

export default function ProfileScreen() {
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
      <Icon name={User} size={48} color='#10b981' />
      <Text variant='heading' style={{ textAlign: 'center', marginTop: 12 }}>
        My Profile
      </Text>
      <Text variant='body' style={{ textAlign: 'center', opacity: 0.7, maxWidth: '80%' }}>
        Manage your profile settings, account configurations, and published content.
      </Text>
      <Card style={{ width: '100%', marginTop: 20 }}>
        <Text variant='caption' style={{ textAlign: 'center' }}>
          Please sign in to view your profile settings.
        </Text>
      </Card>
    </View>
  );
}
