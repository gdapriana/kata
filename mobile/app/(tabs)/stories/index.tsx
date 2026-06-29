import React from 'react';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { BookOpen } from 'lucide-react-native';

export default function StoriesScreen() {
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
      <Icon name={BookOpen} size={48} color='#6366f1' />
      <Text variant='heading' style={{ textAlign: 'center', marginTop: 12 }}>
        Explore Stories
      </Text>
      <Text variant='body' style={{ textAlign: 'center', opacity: 0.7, maxWidth: '80%' }}>
        Find insightful articles, tutorials, and perspectives from global creators.
      </Text>
      <Card style={{ width: '100%', marginTop: 20 }}>
        <Text variant='caption' style={{ textAlign: 'center' }}>
          Stories feed will be loaded here.
        </Text>
      </Card>
    </View>
  );
}
