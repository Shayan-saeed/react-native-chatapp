import { Tabs } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from "@/components/theme/ThemeContext";

export default function Layout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: theme.searchContainerBG, borderTopWidth: 0 },
        tabBarActiveTintColor: "#1E90FF",
        tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Chats",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index.styles"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="[id]/index"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
       <Tabs.Screen
        name="[id]/index.styles"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="screens/profile/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="screens/groups/index"
        options={{
          title: "Groups",
          tabBarIcon: ({ color }) => (
            <Feather name="users" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="screens/calls/index"
        options={{
          title: "Calls",
          tabBarIcon: ({ color }) => (
            <Feather name="phone-call" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="screens/UserDetails/index"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="screens/profile/profile.styles"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="screens/groups/groups.styles"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="screens/calls/calls.styles"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="screens/UserDetails/userdetails.styles"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
