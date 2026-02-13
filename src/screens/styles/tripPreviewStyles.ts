import { StyleSheet } from 'react-native';

import { theme } from '../../theme';

export const tripPreviewStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
    },

    datetimeCard: {
        marginBottom: theme.spacing.lg,
    },

    pricingCard: {
        marginBottom: theme.spacing.lg,
    },

    datetimeRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: theme.spacing.md,
        marginTop: theme.spacing.md,
    },

    datetimeField: {
        flex: 1,
    },

    datetimeLabel: {
        ...theme.textStyles.bodySmall,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
    },

    datetimeSpacer: {
        width: theme.spacing.sm,
    },

    serviceCard: {
        marginBottom: theme.spacing.lg,
    },

    passengerCard: {
        marginBottom: theme.spacing.lg,
    },

    hoursCard: {
        marginBottom: theme.spacing.lg,
    },

    pricingMeta: {
        gap: theme.spacing.xs,
        marginBottom: theme.spacing.md,
    },

    metaText: {
        ...theme.textStyles.bodySmall,
        color: theme.colors.text.secondary,
    },

    breakdownList: {
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },

    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    breakdownConcept: {
        ...theme.textStyles.body,
        color: theme.colors.text.primary,
        flex: 1,
    },

    breakdownAmount: {
        ...theme.textStyles.body,
        color: theme.colors.text.primary,
        fontWeight: theme.fontWeight.semibold,
    },

    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.light,
        paddingTop: theme.spacing.md,
    },

    totalLabel: {
        ...theme.textStyles.bodyLarge,
        color: theme.colors.text.primary,
        fontWeight: theme.fontWeight.semibold,
    },

    totalAmount: {
        ...theme.textStyles.h4,
        color: theme.colors.primary.gold,
        fontWeight: theme.fontWeight.bold,
    },

    serviceTypeChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        marginTop: theme.spacing.md,
    },

    serviceChip: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
        backgroundColor: theme.colors.background.secondary,
    },

    serviceChipSelected: {
        borderColor: theme.colors.primary.gold,
        backgroundColor: theme.colors.background.card,
        ...theme.shadows.gold,
    },

    serviceChipText: {
        ...theme.textStyles.body,
        color: theme.colors.text.primary,
    },

    serviceChipTextSelected: {
        color: theme.colors.primary.gold,
        fontWeight: theme.fontWeight.semibold,
    },

    timePickerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },

    timePickerModal: {
        width: '100%',
        maxHeight: '70%',
    },

    timeList: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },

    timeListContent: {
        gap: theme.spacing.sm,
        paddingBottom: theme.spacing.sm,
    },

    timeOption: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
    },

    timeOptionSelected: {
        borderColor: theme.colors.primary.gold,
        backgroundColor: theme.colors.background.secondary,
    },

    timeOptionText: {
        ...theme.textStyles.bodyLarge,
        color: theme.colors.text.primary,
        textAlign: 'center',
    },

    timePickerClose: {
        marginTop: theme.spacing.sm,
    },

    estimateModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },

    estimateModalCard: {
        width: '100%',
        maxWidth: 420,
        gap: theme.spacing.md,
    },

    estimateModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    estimateModalTitle: {
        ...theme.textStyles.h4,
        color: theme.colors.primary.gold,
        fontWeight: theme.fontWeight.bold,
    },

    estimateModalClose: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background.secondary,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
    },

    estimateModalCloseText: {
        ...theme.textStyles.body,
        color: theme.colors.text.primary,
    },

    estimateStats: {
        gap: theme.spacing.sm,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.background.secondary,
    },

    estimateStatRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    estimateStatLabel: {
        ...theme.textStyles.body,
        color: theme.colors.text.secondary,
    },

    estimateStatValue: {
        ...theme.textStyles.bodyLarge,
        color: theme.colors.text.primary,
        fontWeight: theme.fontWeight.semibold,
    },

    estimateStatValueLong: {
        ...theme.textStyles.body,
        color: theme.colors.text.primary,
        textAlign: 'right',
        flexShrink: 1,
        flexGrow: 1,
    },

    estimateStatValueGold: {
        ...theme.textStyles.h4,
        color: theme.colors.primary.gold,
        fontWeight: theme.fontWeight.bold,
    },

    estimateBreakdown: {
        gap: theme.spacing.sm,
    },

    estimateBreakdownTitle: {
        ...theme.textStyles.bodyLarge,
        color: theme.colors.text.primary,
        fontWeight: theme.fontWeight.semibold,
    },

    estimateBreakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    estimateBreakdownConcept: {
        ...theme.textStyles.body,
        color: theme.colors.text.primary,
        flex: 1,
    },

    estimateBreakdownAmount: {
        ...theme.textStyles.body,
        color: theme.colors.primary.gold,
        fontWeight: theme.fontWeight.semibold,
        textAlign: 'right',
    },

    estimateModalButton: {
        marginTop: theme.spacing.sm,
    },

    confirmModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },

    confirmModalCard: {
        width: '100%',
        maxWidth: 360,
        gap: theme.spacing.md,
    },

    confirmModalTitle: {
        ...theme.textStyles.h4,
        color: theme.colors.text.primary,
        fontWeight: theme.fontWeight.bold,
    },

    confirmModalMessage: {
        ...theme.textStyles.body,
        color: theme.colors.text.secondary,
    },

    confirmModalActions: {
        flexDirection: 'column',
        gap: theme.spacing.sm,
        marginTop: theme.spacing.sm,
    },

    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },

    backButtonText: {
        fontSize: theme.fontSize['2xl'],
        color: theme.colors.primary.gold,
    },

    headerTitle: {
        ...theme.textStyles.h4,
        color: theme.colors.text.primary,
    },

    content: {
        flex: 1,
    },

    contentContainer: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing['2xl'],
    },

    routeCard: {
        marginBottom: theme.spacing.lg,
    },

    routeInfo: {
        marginBottom: theme.spacing.lg,
    },

    routePoint: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    helperText: {
        ...theme.textStyles.caption,
        color: theme.colors.text.tertiary,
        marginTop: theme.spacing.sm,
    },

    errorText: {
        ...theme.textStyles.caption,
        color: theme.colors.status.error,
        marginTop: theme.spacing.sm,
    },

    originDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: theme.colors.map.userLocation,
        marginRight: theme.spacing.md,
    },

    destinationDot: {
        width: 12,
        height: 12,
        backgroundColor: theme.colors.primary.gold,
        marginRight: theme.spacing.md,
    },

    routeLine: {
        width: 2,
        height: theme.spacing.lg,
        backgroundColor: theme.colors.border.light,
        marginLeft: 5,
        marginVertical: theme.spacing.sm,
    },

    routeAddress: {
        ...theme.textStyles.body,
        color: theme.colors.text.primary,
        flex: 1,
    },

    tripDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.light,
    },

    tripDetailItem: {
        alignItems: 'center',
        flex: 1,
    },

    tripDetailLabel: {
        ...theme.textStyles.caption,
        color: theme.colors.text.tertiary,
        marginBottom: theme.spacing.xs,
    },

    tripDetailValue: {
        ...theme.textStyles.h4,
        color: theme.colors.primary.gold,
    },

    tripDetailDivider: {
        width: 1,
        height: theme.spacing['2xl'],
        backgroundColor: theme.colors.border.light,
    },

    sectionTitle: {
        ...theme.textStyles.h4,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },

    infoCard: {
        backgroundColor: theme.colors.background.secondary,
    },

    infoText: {
        ...theme.textStyles.caption,
        color: theme.colors.text.tertiary,
        textAlign: 'center',
        lineHeight: theme.textStyles.caption.lineHeight * 1.5,
    },

    footer: {
        padding: theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.light,
        backgroundColor: theme.colors.background.card,
        ...theme.shadows.lg,
    },
});
