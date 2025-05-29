import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { COLORS } from '@/constants/theme';
import { Mail, MessageCircle, Star, FileText } from 'lucide-react-native';

export default function SupportScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help & Support</Text>
        
        <View style={styles.menuGroup}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Linking.openURL('mailto:support@example.com')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${COLORS.primary}20` }]}>
                <Mail size={22} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.menuLabel}>Contact Support</Text>
                <Text style={styles.menuDescription}>Get help via email</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${COLORS.secondary}20` }]}>
                <MessageCircle size={22} color={COLORS.secondary} />
              </View>
              <View>
                <Text style={styles.menuLabel}>Live Chat</Text>
                <Text style={styles.menuDescription}>Chat with our team</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${COLORS.tertiary}20` }]}>
                <FileText size={22} color={COLORS.tertiary} />
              </View>
              <View>
                <Text style={styles.menuLabel}>Documentation</Text>
                <Text style={styles.menuDescription}>Browse help articles</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${COLORS.accent}20` }]}>
                <Star size={22} color={COLORS.accent} />
              </View>
              <View>
                <Text style={styles.menuLabel}>Rate the App</Text>
                <Text style={styles.menuDescription}>Share your feedback</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  menuGroup: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  menuDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  version: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});