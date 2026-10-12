import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { JobCard } from '../components/JobCard';
import { PressableScale } from '../components/PressableScale';
import { ScreenHeader } from '../components/ScreenHeader';
import { EmptyView, ErrorView, LoadingView } from '../components/StateView';
import { useAppliedJobIds, useJobs } from '../api/queries';
import { useNavigation } from '../state/stores/navigationStore';
import { FacetTitle, Selected, facetOptions, filterJobs, selectedCount } from '../state/jobFilters';
import { IconName } from '../theme/glyphs';
import { colors, fonts } from '../theme/theme';

export function JobsScreen() {
  const insets = useSafeAreaInsets();
  const push = useNavigation((s) => s.push);
  const jobs = useJobs();
  const applied = useAppliedJobIds();

  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selected, setSelected] = useState<Selected>({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  const all = jobs.data ?? [];
  const visible = useMemo(() => filterJobs(all, query, location, selected), [all, query, location, selected]);
  const facets = useMemo(() => facetOptions(all, selected), [all, selected]);
  const activeFilters = selectedCount(selected);

  const toggle = (title: FacetTitle, value: string) =>
    setSelected((s) => {
      const cur = s[title] ?? [];
      return { ...s, [title]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] };
    });

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScreenHeader
        eyebrow="Open roles"
        title="Jobs matching your next move"
        subtitle="Apply today and our team will match you with suitable placements.">
        <View style={styles.searchRow}>
          <SearchInput icon="search" value={query} onChange={setQuery} placeholder="Role, category or type" />
        </View>
        <View style={styles.searchRow}>
          <SearchInput icon="location_on" value={location} onChange={setLocation} placeholder="Location" />
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={`Filters${activeFilters ? `, ${activeFilters} selected` : ''}`}
            onPress={() => setFiltersOpen(true)}
            style={[styles.filterBtn, activeFilters > 0 && styles.filterBtnActive]}>
            <Icon name="tune" size={20} color={activeFilters ? colors.navy800 : colors.white} />
            {activeFilters > 0 && <Text style={styles.filterCount}>{activeFilters}</Text>}
          </PressableScale>
        </View>
      </ScreenHeader>

      {jobs.isPending ? (
        <LoadingView label="Loading open vacancies…" />
      ) : jobs.isError ? (
        <ErrorView message={jobs.error.message} onRetry={() => jobs.refetch()} />
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(j) => j.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={jobs.isRefetching} onRefresh={() => jobs.refetch()} tintColor={colors.blue} />
          }
          ListHeaderComponent={
            <View style={styles.countRow}>
              <Text style={styles.countText}>
                Showing <Text style={styles.countStrong}>{visible.length}</Text> of{' '}
                <Text style={styles.countStrong}>{all.length}</Text> jobs
              </Text>
              {activeFilters > 0 && (
                <PressableScale onPress={() => setSelected({})}>
                  <Text style={styles.clear}>
                    Clear {activeFilters} filter{activeFilters === 1 ? '' : 's'}
                  </Text>
                </PressableScale>
              )}
            </View>
          }
          ListEmptyComponent={
            <EmptyView
              icon="search"
              title="No matching jobs found"
              body="Try clearing some filters or searching with a broader keyword."
            />
          }
          renderItem={({ item }) => (
            <JobCard
              job={item}
              applied={applied.has(item.id)}
              onPress={() => push({ name: 'job', jobId: item.id })}
              onApply={() => push({ name: 'apply', jobId: item.id })}
            />
          )}
        />
      )}

      <Modal
        visible={filtersOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setFiltersOpen(false)}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.sheetHead}>
            <Text style={styles.sheetTitle}>Filter jobs</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Close filters" hitSlop={10} onPress={() => setFiltersOpen(false)}>
              <Icon name="close" size={24} color={colors.ink} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.sheetBody}>
            {facets.map((facet, i) => (
              <FacetSection
                key={facet.title}
                title={facet.title}
                options={facet.options}
                selected={selected[facet.title] ?? []}
                defaultOpen={i < 2 || facet.title === 'Locations'}
                onToggle={(v) => toggle(facet.title, v)}
              />
            ))}
          </ScrollView>
          <View style={styles.sheetFooter}>
            <Button label="Clear all" variant="outline" onPress={() => setSelected({})} style={{ flex: 1 }} />
            <Button label={`Show ${visible.length} job${visible.length === 1 ? '' : 's'}`} onPress={() => setFiltersOpen(false)} style={{ flex: 1.4 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function SearchInput({
  icon,
  value,
  onChange,
  placeholder,
}: {
  icon: IconName;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.search}>
      <Icon name={icon} size={19} color={colors.onNavyMuted} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.onNavyMuted2}
        style={styles.searchInput}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel={placeholder}
      />
      {value.length > 0 && (
        <Pressable accessibilityLabel="Clear" hitSlop={8} onPress={() => onChange('')}>
          <Icon name="close" size={18} color={colors.onNavyMuted} />
        </Pressable>
      )}
    </View>
  );
}

function FacetSection({
  title,
  options,
  selected,
  defaultOpen,
  onToggle,
}: {
  title: string;
  options: { value: string; count: number }[];
  selected: string[];
  defaultOpen: boolean;
  onToggle: (value: string) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View style={styles.facet}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((o) => !o)}
        style={styles.facetHead}>
        <Text style={styles.facetTitle}>{title}</Text>
        <View style={styles.facetHeadRight}>
          {selected.length > 0 && (
            <View style={styles.facetBadge}>
              <Text style={styles.facetBadgeText}>{selected.length}</Text>
            </View>
          )}
          <Icon name={open ? 'expand_less' : 'expand_more'} size={22} color={colors.textMuted} />
        </View>
      </Pressable>
      {open &&
        options.map((o) => {
          const on = selected.includes(o.value);
          return (
            <Pressable
              key={o.value}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              onPress={() => onToggle(o.value)}
              style={styles.option}>
              <View style={[styles.checkbox, on && styles.checkboxOn]}>
                {on && <Icon name="check" size={15} color={colors.white} />}
              </View>
              <Text style={styles.optionLabel}>{o.value}</Text>
              <Text style={styles.optionCount}>{o.count}</Text>
            </Pressable>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, minHeight: 0, backgroundColor: colors.bg },
  searchRow: { flexDirection: 'row', gap: 10 },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 13,
    paddingHorizontal: 13,
    minHeight: 48,
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14.5, fontFamily: fonts.medium, color: colors.white },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  filterBtnActive: { backgroundColor: colors.sky, borderColor: colors.sky, width: 62 },
  filterCount: { fontSize: 13, fontFamily: fonts.bold, color: colors.navy800 },
  list: { padding: 18, paddingBottom: 32 },
  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  countText: { fontSize: 13, fontFamily: fonts.medium, color: colors.textMuted },
  countStrong: { fontFamily: fonts.bold, color: colors.ink },
  clear: { fontSize: 13, fontFamily: fonts.semiBold, color: colors.berry },
  sheet: { flex: 1, backgroundColor: colors.white },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  sheetTitle: { fontSize: 19, fontFamily: fonts.bold, color: colors.ink },
  sheetBody: { paddingHorizontal: 22, paddingBottom: 20 },
  sheetFooter: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 22,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  facet: { borderBottomWidth: 1, borderBottomColor: colors.borderLight, paddingVertical: 4 },
  facetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  facetTitle: { fontSize: 14.5, fontFamily: fonts.bold, color: colors.ink },
  facetHeadRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  facetBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facetBadgeText: { fontSize: 11, fontFamily: fonts.bold, color: colors.white },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, minHeight: 44 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.signBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.blue, borderColor: colors.blue },
  optionLabel: { flex: 1, fontSize: 14, fontFamily: fonts.medium, color: colors.textSlate },
  optionCount: { fontSize: 12.5, fontFamily: fonts.semiBold, color: colors.textMuted2 },
});
