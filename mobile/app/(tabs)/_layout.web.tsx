import React from 'react';
import { Icon } from '@/components/ui/icon';
import { useColor } from '@/hooks/useColor';
import { Tabs } from 'expo-router';
import { Home, BookOpen, Bell, User } from 'lucide-react-native';

export default function WebTabsLayout() {
  const primary = useColor('primary');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: primary,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon name={Home} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='stories'
        options={{
          title: 'Stories',
          tabBarIcon: ({ color }) => (
            <Icon name={BookOpen} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='activity'
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => (
            <Icon name={Bell} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Icon name={User} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
