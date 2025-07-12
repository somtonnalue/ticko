import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/colors';
import { BorderRadius, Spacing, Typography } from '@/constants/dimensions';
import { Event } from '@/types/ticket';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface EventCardProps {
  event: Event;
  onPress: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <TouchableOpacity onPress={() => onPress(event)} activeOpacity={0.9}>
      <Card variant="elevated" padding="sm" style={styles.card}>
        <Image source={{ uri: event.image }} style={styles.image} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {event.title}
            </Text>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>From</Text>
              <Text style={styles.price}>${event.price.min}</Text>
            </View>
          </View>
          
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
          
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Ionicons 
                name="calendar-outline" 
                size={16} 
                color={Colors.text.secondary} 
              />
              <Text style={styles.detailText}>
                {formatDate(event.date)} • {formatTime(event.time)}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons 
                name="location-outline" 
                size={16} 
                color={Colors.text.secondary} 
              />
              <Text style={styles.detailText} numberOfLines={1}>
                {event.venue}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons 
                name="people-outline" 
                size={16} 
                color={Colors.text.secondary} 
              />
              <Text style={styles.detailText}>
                {event.availableSeats} seats left
              </Text>
            </View>
          </View>
          
          <View style={styles.footer}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {event.category.toUpperCase()}
              </Text>
            </View>
            <View style={styles.availabilityIndicator}>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: event.availableSeats > 0 ? Colors.status.success : Colors.status.error }
                ]} 
              />
              <Text style={styles.statusText}>
                {event.availableSeats > 0 ? 'Available' : 'Sold Out'}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  content: {
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginRight: Spacing.sm,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  price: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[600],
  },
  description: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.sm,
  },
  details: {
    gap: Spacing.xs,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  categoryBadge: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary[700],
  },
  availabilityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
  },
}); 