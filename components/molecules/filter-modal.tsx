import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/colors';
import { BorderRadius, Spacing, Typography } from '@/constants/dimensions';
import { EventCategory, SearchFilters } from '@/types/ticket';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: SearchFilters) => void;
  currentFilters: SearchFilters;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<SearchFilters>(currentFilters);
  
  const categories: EventCategory[] = [
    'concert', 'sports', 'theater', 'comedy', 'conference', 'festival'
  ];

  const priceRanges = [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200 - $500', min: 200, max: 500 },
    { label: 'Over $500', min: 500, max: 10000 },
  ];

  const dateRanges = [
    { label: 'Today', days: 0 },
    { label: 'This Week', days: 7 },
    { label: 'This Month', days: 30 },
    { label: 'Next 3 Months', days: 90 },
  ];

  const locations = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'San Francisco, CA',
    'Miami, FL',
    'Boston, MA',
  ];

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    const emptyFilters: SearchFilters = {};
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    onClose();
  };

  const isFilterActive = (type: string, value: any) => {
    switch (type) {
      case 'category':
        return filters.category === value;
      case 'price':
        return filters.priceRange?.min === value.min && filters.priceRange?.max === value.max;
      case 'date':
        // Check if the date range matches
        return false; // Simplified for now
      case 'location':
        return filters.location === value;
      default:
        return false;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={handleClearFilters}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.optionsGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.optionChip,
                    isFilterActive('category', category) && styles.optionChipActive
                  ]}
                  onPress={() => {
                    setFilters(prev => ({
                      ...prev,
                      category: prev.category === category ? undefined : category
                    }));
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    isFilterActive('category', category) && styles.optionTextActive
                  ]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Range</Text>
            <View style={styles.optionsColumn}>
              {priceRanges.map((range) => (
                <TouchableOpacity
                  key={range.label}
                  style={[
                    styles.optionRow,
                    isFilterActive('price', range) && styles.optionRowActive
                  ]}
                  onPress={() => {
                    const isCurrentlySelected = isFilterActive('price', range);
                    setFilters(prev => ({
                      ...prev,
                      priceRange: isCurrentlySelected ? undefined : range
                    }));
                  }}
                >
                  <Text style={[
                    styles.optionRowText,
                    isFilterActive('price', range) && styles.optionRowTextActive
                  ]}>
                    {range.label}
                  </Text>
                  {isFilterActive('price', range) && (
                    <Ionicons name="checkmark" size={20} color={Colors.primary[600]} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>When</Text>
            <View style={styles.optionsColumn}>
              {dateRanges.map((dateRange) => (
                <TouchableOpacity
                  key={dateRange.label}
                  style={styles.optionRow}
                  onPress={() => {
                    const today = new Date();
                    const endDate = new Date();
                    endDate.setDate(today.getDate() + dateRange.days);
                    
                    setFilters(prev => ({
                      ...prev,
                      dateRange: {
                        start: today.toISOString(),
                        end: endDate.toISOString(),
                      }
                    }));
                  }}
                >
                  <Text style={styles.optionRowText}>{dateRange.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.optionsColumn}>
              {locations.map((location) => (
                <TouchableOpacity
                  key={location}
                  style={[
                    styles.optionRow,
                    isFilterActive('location', location) && styles.optionRowActive
                  ]}
                  onPress={() => {
                    const isCurrentlySelected = isFilterActive('location', location);
                    setFilters(prev => ({
                      ...prev,
                      location: isCurrentlySelected ? undefined : location
                    }));
                  }}
                >
                  <Text style={[
                    styles.optionRowText,
                    isFilterActive('location', location) && styles.optionRowTextActive
                  ]}>
                    {location}
                  </Text>
                  {isFilterActive('location', location) && (
                    <Ionicons name="checkmark" size={20} color={Colors.primary[600]} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Apply Filters"
            onPress={handleApplyFilters}
            fullWidth
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  clearText: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary[600],
    fontWeight: Typography.fontWeight.medium,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Spacing.xl,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    backgroundColor: Colors.background.secondary,
  },
  optionChipActive: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[600],
  },
  optionText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  optionTextActive: {
    color: Colors.neutral.white,
  },
  optionsColumn: {
    gap: Spacing.xs,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.secondary,
  },
  optionRowActive: {
    backgroundColor: Colors.primary[50],
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  optionRowText: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  optionRowTextActive: {
    color: Colors.primary[700],
    fontFamily: Typography.fontFamily.semibold,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
}); 