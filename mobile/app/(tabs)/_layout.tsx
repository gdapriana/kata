import { Platform } from 'react-native';
import { useColor } from '@/hooks/useColor';
import FeatherIcon from '@expo/vector-icons/Feather';
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from 'expo-router/unstable-native-tabs';

export default function TabsLayout() {
  const red = useColor('red');
  const primary = useColor('primary');
  const foreground = useColor('foreground');

  return (
    <NativeTabs
      minimizeBehavior='onScrollDown'
      labelStyle={{
        default: { color: primary },
        selected: { color: foreground },
      }}
      iconColor={{
        default: primary,
        selected: foreground,
      }}
      badgeBackgroundColor={red}
      labelVisibilityMode='labeled'
      disableTransparentOnScrollEdge={true}
    >
      <NativeTabs.Trigger name='(home)'>
        {Platform.select({
          ios: <Icon sf='house.fill' />,
          android: (
            <Icon src={<VectorIcon family={FeatherIcon} name='home' />} />
          ),
        })}
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='stories'>
        {Platform.select({
          ios: <Icon sf='book.closed.fill' />,
          android: (
            <Icon src={<VectorIcon family={FeatherIcon} name='book-open' />} />
          ),
        })}
        <Label>Stories</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='activity'>
        {Platform.select({
          ios: <Icon sf='bell.fill' />,
          android: (
            <Icon src={<VectorIcon family={FeatherIcon} name='bell' />} />
          ),
        })}
        <Label>Activity</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='profile'>
        {Platform.select({
          ios: <Icon sf='person.crop.circle.fill' />,
          android: (
            <Icon src={<VectorIcon family={FeatherIcon} name='user' />} />
          ),
        })}
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
