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

    pricingActions: {
        marginTop: theme.spacing.md,
        gap: theme.spacing.sm,
    },

    pricingDisclaimer: {
        ...theme.textStyles.caption,
        color: theme.colors.text.secondary,
        textAlign: 'center',
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
        marginBottom: theme.spacing.md,
        paddingVertical: theme.spacing.md,
    },

    inlinePickerContainer: {
        height: 120,
        marginTop: theme.spacing.sm,
        marginBottom: 0,
        overflow: 'hidden',
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.background.primary,
        width: 200,
        alignSelf: 'center',
    },
    // helperText duplicado eliminado para evitar conflicto de claves
    // pickerHighlight y sectionTitle duplicados eliminados abajo

    selectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.sm,
    },

    selectLabel: {
        ...theme.textStyles.bodySmall,
        color: theme.colors.text.primary,
        fontWeight: theme.fontWeight.semibold,
    },

    selectChevron: {
        ...theme.textStyles.body,
        color: theme.colors.primary.gold,
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
        gap: theme.spacing.xs,
        marginBottom: theme.spacing.sm,
    },

    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    breakdownConcept: {
        ...theme.textStyles.bodySmall,
        color: theme.colors.text.primary,
        flex: 1,
    },

    breakdownAmount: {
        ...theme.textStyles.bodySmall,
        color: theme.colors.text.primary,
        fontWeight: theme.fontWeight.semibold,
    },

    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.light,
        paddingTop: theme.spacing.sm,
    },

    totalLabel: {
        ...theme.textStyles.caption,
        color: theme.colors.text.primary,
        fontWeight: theme.fontWeight.semibold,
    },

    totalAmount: {
        ...theme.textStyles.body,
        color: theme.colors.primary.gold,
        fontWeight: theme.fontWeight.bold,
    },

    serviceTypeChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
        marginTop: theme.spacing.sm,
    },

    serviceChip: {
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
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
        ...theme.textStyles.bodySmall,
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
        maxHeight: '55%',
    },

    pickerContainer: {
        height: 210,
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.background.secondary,
    },

    pickerHighlight: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        height: 40,
        marginTop: -20,
        borderWidth: 0,
        borderRadius: theme.borderRadius.md,
        backgroundColor: 'transparent',
    },

    sheetHandle: {
        width: 48,
        height: 5,
        borderRadius: 3,
        backgroundColor: theme.colors.border.light,
        alignSelf: 'center',
        marginBottom: theme.spacing.sm,
    },

    sheetSubtitle: {
        ...theme.textStyles.bodySmall,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    },

    timeOption: {
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background.secondary,
    },

    timeOptionSelected: {
        backgroundColor: 'transparent',
    },

    timeOptionMuted: {
        opacity: 0.25,
    },

    timeOptionTextMuted: {
        color: theme.colors.text.primary,
    },

    timeOptionText: {
        ...theme.textStyles.caption,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },

    timeOptionTextSelected: {
        color: theme.colors.primary.gold,
        fontWeight: theme.fontWeight.bold,
    },

    timePickerClose: {
        marginTop: theme.spacing.sm,
    },

    estimateModalOverlay: {
        flex: 1,
        backgroundColor: '#000', // Fondo completamente opaco
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
        flexWrap: 'wrap',
    },

    estimateDestinationValue: {
        ...theme.textStyles.bodyLarge,
        color: theme.colors.primary.gold,
        fontWeight: theme.fontWeight.bold,
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
        backgroundColor: '#000',
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
        textAlign: 'center',
    },

    confirmModalMessage: {
        ...theme.textStyles.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },

    confirmModalActions: {
        flexDirection: 'column',
        gap: theme.spacing.sm,
        marginTop: theme.spacing.sm,
    },

    backButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },

    backButtonText: {
        fontSize: theme.fontSize['3xl'],
        color: theme.colors.primary.gold,
        fontWeight: theme.fontWeight.semibold,
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

    placeholderText: {
        color: theme.colors.text.tertiary,
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
        ...theme.textStyles.bodySmall,
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
        ...theme.textStyles.body,
        color: theme.colors.primary.gold,
        fontWeight: theme.fontWeight.semibold,
    },

    tripDetailDivider: {
        width: 1,
        height: theme.spacing['2xl'],
        backgroundColor: theme.colors.border.light,
    },

    sectionTitle: {
        ...theme.textStyles.bodySmall,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
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
